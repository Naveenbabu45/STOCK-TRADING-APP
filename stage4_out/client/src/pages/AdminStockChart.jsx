import { useState, useEffect, useCallback } from 'react';
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
import { TrendingUp, Search, BarChart3 } from 'lucide-react';
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

const AdminStockChart = () => {
  const { showToast } = useGeneralContext();
  const [stocks, setStocks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchStocks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/stocks');
      setStocks(data);
      if (data.length > 0) setSelected(data[0]);
    } catch {
      showToast('Failed to load stocks', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const fetchHistory = useCallback(async (symbol) => {
    if (!symbol) return;
    setChartLoading(true);
    try {
      const { data } = await axiosInstance.get(`/stocks/history/${symbol}`);
      setHistory(data);
    } catch {
      showToast('Failed to load chart data', 'error');
    } finally {
      setChartLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  useEffect(() => {
    if (selected) fetchHistory(selected.symbol);
  }, [selected, fetchHistory]);

  const filtered = stocks.filter(
    (s) =>
      s.symbol?.toLowerCase().includes(search.toLowerCase()) ||
      s.name?.toLowerCase().includes(search.toLowerCase())
  );

  const chartData = {
    labels: history.map((h) => h.date || h.time || ''),
    datasets: [
      {
        label: `${selected?.symbol} Price`,
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
        callbacks: { label: (ctx) => `$${fmt(ctx.parsed.y)}` },
      },
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', maxTicksLimit: 8 } },
      y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', callback: (v) => `$${v}` } },
    },
  };

  if (loading) return <Loading label="Loading stocks…" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart3 size={24} className="text-finance-400" /> Stock Charts
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">Analyze price movements across the market</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Stock list */}
        <div className="lg:col-span-1">
          <div className="relative mb-4">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search stocks…"
              className="glass-input pl-11"
            />
          </div>
          <div className="glass-card overflow-hidden max-h-[600px] overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="p-6 text-center text-slate-400 text-sm">No stocks found</p>
            ) : (
              filtered.map((s) => (
                <button
                  key={s._id || s.symbol}
                  onClick={() => setSelected(s)}
                  className={`w-full flex items-center justify-between px-4 py-3 border-b border-white/5 last:border-0 transition-colors text-left ${
                    selected?.symbol === s.symbol ? 'bg-finance-600/15' : 'hover:bg-white/5'
                  }`}
                >
                  <div>
                    <p className={`font-semibold ${selected?.symbol === s.symbol ? 'text-finance-300' : 'text-white'}`}>
                      {s.symbol}
                    </p>
                    <p className="text-xs text-slate-500 truncate max-w-[140px]">{s.name}</p>
                  </div>
                  <span className="font-mono text-sm text-slate-300">${fmt(s.price)}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-3 space-y-6">
          {selected && (
            <div className="glass-card p-6">
              <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-white">{selected.symbol}</h2>
                    <span className="badge bg-white/5 text-slate-400">{selected.stockExchange || 'NASDAQ'}</span>
                  </div>
                  <p className="text-slate-400 mt-1">{selected.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white font-mono">${fmt(selected.price)}</p>
                  <p className={`text-sm flex items-center gap-1 justify-end ${(selected.change ?? selected.changePercent ?? 0) >= 0 ? 'text-gain' : 'text-loss'}`}>
                    <TrendingUp size={14} />
                    {selected.change ?? selected.changePercent ?? 0}%
                  </p>
                </div>
              </div>

              <div className="h-72 sm:h-96">
                {chartLoading ? (
                  <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                    Loading chart…
                  </div>
                ) : history.length > 0 ? (
                  <Line data={chartData} options={chartOptions} />
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                    No historical data available
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStockChart;
