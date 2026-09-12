import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Wallet, TrendingUp, TrendingDown, PieChart, ArrowRight, RefreshCw } from 'lucide-react';
import axiosInstance from '../components/axiosInstance';
import { useGeneralContext } from '../context/GeneralContext';
import PortfolioCard from '../components/PortfolioCard';
import Loading from '../components/Loading';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const fmt = (n) =>
  Number(n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const Portfolio = () => {
  const { balance, portfolio, setPortfolio, showToast } = useGeneralContext();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPortfolio = useCallback(async (quiet = false) => {
    if (quiet) setRefreshing(true); else setLoading(true);
    try {
      const { data } = await axiosInstance.get('/stocks/portfolio/me');
      setPortfolio(data || []);
    } catch {
      showToast('Failed to load portfolio', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [setPortfolio, showToast]);

  useEffect(() => { fetchPortfolio(); }, [fetchPortfolio]);

  const allocation = portfolio.map((h) => ({ symbol: h.symbol, value: Number(h.marketValue || 0) })).filter((h) => h.value > 0);
  const allocationData = { labels: allocation.map((h) => h.symbol), datasets: [{ data: allocation.map((h) => h.value), borderWidth: 0 }] };
  const allocationOptions = { plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 12, padding: 14 } } }, cutout: '68%', responsive: true, maintainAspectRatio: false };
  const bestHolding = [...portfolio].sort((a, b) => Number(b.pnl || 0) - Number(a.pnl || 0))[0];
  const worstHolding = [...portfolio].sort((a, b) => Number(a.pnl || 0) - Number(b.pnl || 0))[0];

  const totalValue = portfolio.reduce((sum, h) => sum + (h.marketValue ?? (h.currentPrice ?? h.price ?? 0) * (h.count ?? 0)), 0);
  const totalCost = portfolio.reduce((sum, h) => sum + (h.totalPrice ?? 0), 0);
  const totalPnl = totalValue - totalCost;
  const pnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;
  const isUp = totalPnl >= 0;
  const netWorth = balance + totalValue;

  if (loading) return <Loading label="Loading your portfolio…" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Briefcase size={24} className="text-finance-400" /> Portfolio
        </h1>
        <div className="flex items-start justify-between gap-4"><p className="text-sm text-slate-400 mt-0.5">Your holdings and performance</p><button onClick={() => fetchPortfolio(true)} disabled={refreshing} className="btn-ghost !py-2 !px-3 text-xs"><RefreshCw size={14} className={refreshing ? 'animate-spin' : ''}/> Refresh</button></div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <p className="text-xs text-slate-400 flex items-center gap-1"><Wallet size={12} /> Cash Balance</p>
          <p className="text-2xl font-bold text-white font-mono">${fmt(balance)}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-slate-400 flex items-center gap-1"><PieChart size={12} /> Holdings Value</p>
          <p className="text-2xl font-bold text-white font-mono">${fmt(totalValue)}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-slate-400 flex items-center gap-1">
            {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />} Total P&amp;L
          </p>
          <p className={`text-2xl font-bold font-mono ${isUp ? 'text-gain' : 'text-loss'}`}>
            {isUp ? '+' : ''}${fmt(totalPnl)}
          </p>
          <p className={`text-xs ${isUp ? 'text-gain' : 'text-loss'}`}>
            {isUp ? '+' : ''}{pnlPct.toFixed(2)}%
          </p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-slate-400">Net Worth</p>
          <p className="text-2xl font-bold text-gradient font-mono">${fmt(netWorth)}</p>
        </div>
      </div>

      {portfolio.length > 0 && (
        <div className="grid lg:grid-cols-3 gap-4 mb-8">
          <div className="glass-card p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-5"><div><p className="text-sm font-semibold text-white">Position overview</p><p className="text-xs text-slate-500 mt-1">Where your invested capital is currently allocated.</p></div><PieChart size={18} className="text-finance-400"/></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4"><p className="text-xs text-slate-500">Largest position</p><p className="text-xl font-bold text-white mt-1">{allocation.sort((a,b)=>b.value-a.value)[0]?.symbol || '—'}</p><p className="text-sm text-slate-400 mt-1">${fmt(Math.max(...allocation.map(a=>a.value), 0))} market value</p></div>
              <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4"><p className="text-xs text-slate-500">Positions</p><p className="text-xl font-bold text-white mt-1">{portfolio.length}</p><p className="text-sm text-slate-400 mt-1">{bestHolding ? `Best P&L: ${bestHolding.symbol}` : 'No performance yet'}</p></div>
            </div>
          </div>
          <div className="glass-card p-5"><p className="text-sm font-semibold text-white">Allocation</p><div className="h-52 mt-3"><Doughnut data={allocationData} options={allocationOptions}/></div></div>
        </div>
      )}

      {portfolio.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="glass-card p-5"><p className="text-xs text-slate-500">Top performer</p><p className="text-lg font-bold text-white mt-1">{bestHolding?.symbol || '—'}</p><p className="text-sm text-gain mt-1">{bestHolding ? `+$${fmt(Math.abs(bestHolding.pnl || 0))} P&L` : '—'}</p></div>
          <div className="glass-card p-5"><p className="text-xs text-slate-500">Needs attention</p><p className="text-lg font-bold text-white mt-1">{worstHolding?.symbol || '—'}</p><p className="text-sm text-loss mt-1">{worstHolding ? `${worstHolding.pnl >= 0 ? '+' : '-'}$${fmt(Math.abs(worstHolding.pnl || 0))} P&L` : '—'}</p></div>
        </div>
      )}

      {/* Holdings */}
      {portfolio.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Briefcase size={40} className="mx-auto text-slate-500 mb-4" />
          <h2 className="text-lg font-semibold text-white mb-2">No holdings yet</h2>
          <p className="text-slate-400 mb-6">Start trading to build your portfolio.</p>
          <Link to="/dashboard" className="btn-primary">
            Browse Stocks <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolio.map((h) => (
            <PortfolioCard key={h._id || h.symbol} holding={h} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Portfolio;
