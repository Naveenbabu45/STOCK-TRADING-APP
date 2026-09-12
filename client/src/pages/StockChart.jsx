import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeft,
  AlertCircle,
  Wallet,
  Star,
} from 'lucide-react';
import axiosInstance from '../components/axiosInstance';
import { useGeneralContext } from '../context/GeneralContext';
import Loading from '../components/Loading';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const fmt = (n) =>
  Number(n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const StockChart = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const { balance, refreshProfile, showToast } = useGeneralContext();

  const [stock, setStock] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderType, setOrderType] = useState('buy'); // buy | sell
  const [qty, setQty] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [range, setRange] = useState('1mo');
  const [watching, setWatching] = useState(false);

  useEffect(() => {
    axiosInstance.get('/users/watchlist').then(({ data }) => setWatching((data || []).includes(symbol.toUpperCase()))).catch(() => {});
  }, [symbol]);

  const fetchStock = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [stockRes, histRes] = await Promise.all([
        axiosInstance.get(`/stocks/${symbol}`),
        axiosInstance.get(`/stocks/history/${symbol}?range=${range}`),
      ]);
      setStock(stockRes.data);
      setHistory(histRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stock data.');
    } finally {
      setLoading(false);
    }
  }, [symbol, range]);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  const toggleWatchlist = async () => {
    try {
      if (watching) { await axiosInstance.delete(`/users/watchlist/${symbol}`); setWatching(false); showToast(`${symbol} removed from watchlist`, 'info'); }
      else { await axiosInstance.post('/users/watchlist', { symbol }); setWatching(true); showToast(`${symbol} added to watchlist`, 'success'); }
    } catch (err) { showToast(err.response?.data?.message || 'Unable to update watchlist', 'error'); }
  };

  const handleTrade = async (e) => {
    e.preventDefault();
    if (!stock) return;
    setSubmitting(true);
    try {
      await axiosInstance.post('/orders', {
        symbol: stock.symbol,
        name: stock.name,
        count: Number(qty),
        orderType,
      });

      // Record a transaction for the order
      showToast(`${orderType === 'buy' ? 'Buy' : 'Sell'} order placed for ${qty} ${stock.symbol}`, 'success');
      await refreshProfile();
      navigate('/portfolio');
    } catch (err) {
      showToast(err.response?.data?.message || 'Order failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading label={`Loading ${symbol}…`} />;

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="glass-card p-10 text-center">
          <AlertCircle size={40} className="mx-auto text-loss mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Couldn&apos;t load this stock</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <Link to="/dashboard" className="btn-primary">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const change = stock?.changePercent ?? 0;
  const isUp = change >= 0;
  const total = (stock?.price ?? 0) * Number(qty);

  const chartData = {
    labels: history.map((h) => h.date || h.time || ''),
    datasets: [
      {
        label: `${symbol} Price`,
        data: history.map((h) => h.price ?? h.close ?? 0),
        borderColor: '#3b82f6',
        backgroundColor: (ctx) => {
          const { ctx: c, chartArea } = ctx.chart;
          if (!chartArea) return null;
          const grad = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          grad.addColorStop(0, 'rgba(59, 130, 246, 0.35)');
          grad.addColorStop(1, 'rgba(59, 130, 246, 0)');
          return grad;
        },
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#3b82f6',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(11, 17, 32, 0.95)',
        borderColor: 'rgba(59, 130, 246, 0.3)',
        borderWidth: 1,
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        callbacks: {
          label: (ctx) => `$${fmt(ctx.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#64748b', maxTicksLimit: 8 },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: {
          color: '#64748b',
          callback: (v) => `$${v}`,
        },
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-6">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart + Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="glass-card p-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-white">{stock?.symbol}</h1>
                  <span className="badge bg-white/5 text-slate-400">{stock?.stockExchange || 'NASDAQ'}</span>
                </div>
                <p className="text-slate-400 mt-1">{stock?.name}</p>
              </div>
              <div className="flex items-start gap-4">
                <button type="button" onClick={toggleWatchlist} className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors ${watching ? 'border-amber-400/30 bg-amber-400/10 text-amber-300' : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'}`} title={watching ? 'Remove from watchlist' : 'Add to watchlist'}>
                  <Star size={18} fill={watching ? 'currentColor' : 'none'} />
                </button>
                <div className="text-right">
                <p className="text-3xl font-bold text-white font-mono">${fmt(stock?.price)}</p>
                <p className={`text-sm font-medium flex items-center gap-1 justify-end ${isUp ? 'text-gain' : 'text-loss'}`}>
                  {isUp ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
                  {isUp ? '+' : ''}{change}%
                </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="glass-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div><h2 className="font-semibold text-white">Price History</h2><p className="text-xs text-slate-500 mt-0.5">Historical market movement</p></div>
              <div className="flex items-center gap-1 glass rounded-lg p-1">
                {[['1d','1D'],['5d','5D'],['1mo','1M'],['6mo','6M'],['1y','1Y']].map(([value,label]) => <button key={value} onClick={() => setRange(value)} className={`px-2.5 py-1.5 rounded-md text-xs font-medium ${range === value ? 'bg-finance-600/25 text-finance-300' : 'text-slate-500 hover:text-slate-200'}`}>{label}</button>)}
              </div>
            </div>
            <div className="h-72 sm:h-96">
              {history.length > 0 ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                  No historical data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Trade Panel */}
        <div className="space-y-6">
          <div className="glass-card p-6 sticky top-20">
            <h2 className="font-semibold text-white mb-4">Place Order</h2>

            {/* Buy / Sell toggle */}
            <div className="grid grid-cols-2 gap-2 mb-5">
              <button
                onClick={() => setOrderType('buy')}
                className={`py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                  orderType === 'buy'
                    ? 'bg-gradient-to-r from-gain to-gain-dark text-white shadow-lg shadow-gain/30'
                    : 'glass text-slate-400 hover:text-slate-200'
                }`}
              >
                <ArrowUpRight size={18} /> Buy
              </button>
              <button
                onClick={() => setOrderType('sell')}
                className={`py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                  orderType === 'sell'
                    ? 'bg-gradient-to-r from-loss to-loss-dark text-white shadow-lg shadow-loss/30'
                    : 'glass text-slate-400 hover:text-slate-200'
                }`}
              >
                <ArrowDownRight size={18} /> Sell
              </button>
            </div>

            <form onSubmit={handleTrade} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Price (per share)</label>
                <div className="glass-input flex items-center px-4 py-3">
                  <span className="text-slate-500 mr-2">$</span>
                  <span className="font-mono text-white">{fmt(stock?.price)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, e.target.value))}
                  className="glass-input"
                />
              </div>

              <div className="glass p-4 rounded-xl space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Order Type</span>
                  <span className="text-white font-medium capitalize">{orderType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Quantity</span>
                  <span className="text-white font-mono">{qty}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10">
                  <span className="text-slate-300 font-medium">Estimated Total</span>
                  <span className="text-white font-bold font-mono">${fmt(total)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span className="flex items-center gap-1">
                  <Wallet size={13} /> Available
                </span>
                <span className="font-mono text-white">${fmt(balance)}</span>
              </div>

              <button
                type="submit"
                disabled={submitting || (orderType === 'buy' && total > balance)}
                className={orderType === 'buy' ? 'btn-primary w-full' : 'btn-danger w-full'}
              >
                {submitting
                  ? 'Placing order…'
                  : orderType === 'buy'
                  ? `Buy ${qty} ${stock?.symbol}`
                  : `Sell ${qty} ${stock?.symbol}`}
              </button>

              {orderType === 'buy' && total > balance && (
                <p className="text-xs text-loss flex items-center gap-1.5 justify-center">
                  <AlertCircle size={13} /> Insufficient balance for this order
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockChart;
