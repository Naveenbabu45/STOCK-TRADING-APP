import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, TrendingDown, BarChart3, RefreshCw, LayoutGrid, List, Briefcase, Wallet, ArrowRight, Star } from 'lucide-react';
import axiosInstance from '../components/axiosInstance';
import { useGeneralContext } from '../context/GeneralContext';
import StockCard from '../components/StockCard';
import StockTable from '../components/StockTable';
import Loading from '../components/Loading';

const ITEMS_PER_PAGE = 12;
const fmt = (n) => Number(n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const Home = () => {
  const { showToast, balance } = useGeneralContext();
  const [stocks, setStocks] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid');
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  const fetchData = useCallback(async (quiet = false) => {
    if (quiet) setRefreshing(true); else setLoading(true);
    try {
      const [marketRes, portfolioRes, watchlistRes] = await Promise.all([
        axiosInstance.get('/stocks'),
        axiosInstance.get('/stocks/portfolio/me'),
        axiosInstance.get('/users/watchlist'),
      ]);
      setStocks(marketRes.data || []);
      setPortfolio(portfolioRes.data || []);
      setWatchlist(watchlistRes.data || []);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to load dashboard', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = stocks
    .filter((s) => filter === 'watchlist' ? watchlist.includes(s.symbol) : true)
    .filter((s) => s.symbol?.toLowerCase().includes(search.toLowerCase()) || s.name?.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);
  const gainers = stocks.filter((s) => (s.changePercent ?? 0) > 0).length;
  const losers = stocks.filter((s) => (s.changePercent ?? 0) < 0).length;
  const holdingsValue = portfolio.reduce((sum, h) => sum + Number(h.marketValue || 0), 0);
  const totalPnl = portfolio.reduce((sum, h) => sum + Number(h.pnl || 0), 0);
  const netWorth = balance + holdingsValue;
  const topMovers = [...stocks].sort((a, b) => Math.abs(b.changePercent || 0) - Math.abs(a.changePercent || 0)).slice(0, 3);

  if (loading) return <Loading label="Loading your trading dashboard…" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-finance-400 font-semibold mb-2">Paper Trading</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Your market workspace</h1>
          <p className="text-slate-400 mt-2 max-w-2xl">Track the market, manage your watchlist, and trade with virtual capital.</p>
        </div>
        <button onClick={() => fetchData(true)} disabled={refreshing} className="btn-ghost self-start lg:self-auto !py-2.5 !px-4">
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} /> Refresh market
        </button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div className="stat-card"><p className="text-xs text-slate-400 flex items-center gap-1"><Wallet size={12}/> Cash</p><p className="text-2xl font-bold text-white font-mono">${fmt(balance)}</p></div>
        <div className="stat-card"><p className="text-xs text-slate-400 flex items-center gap-1"><Briefcase size={12}/> Portfolio value</p><p className="text-2xl font-bold text-white font-mono">${fmt(holdingsValue)}</p></div>
        <div className="stat-card"><p className="text-xs text-slate-400">Unrealized P&amp;L</p><p className={`text-2xl font-bold font-mono ${totalPnl >= 0 ? 'text-gain' : 'text-loss'}`}>{totalPnl >= 0 ? '+' : '-'}${fmt(Math.abs(totalPnl))}</p></div>
        <div className="stat-card"><p className="text-xs text-slate-400">Net worth</p><p className="text-2xl font-bold text-gradient font-mono">${fmt(netWorth)}</p></div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-8">
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4"><div><p className="text-sm font-semibold text-white">Market pulse</p><p className="text-xs text-slate-500">Current movers across your market</p></div><BarChart3 size={18} className="text-finance-400"/></div>
          <div className="grid sm:grid-cols-3 gap-3">
            {topMovers.map((stock) => {
              const up = (stock.changePercent || 0) >= 0;
              return <Link key={stock.symbol} to={`/stock/${stock.symbol}`} className="rounded-xl border border-white/5 bg-white/[0.03] p-4 hover:bg-white/[0.06] transition-colors">
                <div className="flex justify-between items-center"><span className="font-bold text-white">{stock.symbol}</span><span className={up ? 'text-gain text-xs' : 'text-loss text-xs'}>{up ? '+' : ''}{fmt(stock.changePercent)}%</span></div>
                <p className="text-lg font-mono font-semibold text-white mt-2">${fmt(stock.price)}</p>
              </Link>;
            })}
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-white">Market breadth</p><p className="text-xs text-slate-500">{stocks.length} tracked equities</p></div><span className="badge bg-finance-500/10 text-finance-300"><Star size={12}/> {watchlist.length} watching</span></div>
          <div className="grid grid-cols-2 gap-3 mt-5"><div className="rounded-xl bg-gain/5 border border-gain/10 p-4"><p className="text-xs text-slate-500">Gainers</p><p className="text-2xl font-bold text-gain">{gainers}</p></div><div className="rounded-xl bg-loss/5 border border-loss/10 p-4"><p className="text-xs text-slate-500">Losers</p><p className="text-2xl font-bold text-loss">{losers}</p></div></div>
          <Link to="/portfolio" className="inline-flex items-center gap-1.5 text-sm text-finance-400 hover:text-finance-300 mt-5">View portfolio <ArrowRight size={14}/></Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1"><Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"/><input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search symbol or company…" className="glass-input pl-11"/></div>
        <div className="flex gap-1 glass rounded-xl p-1">
          <button onClick={() => {setFilter('all'); setPage(1)}} className={`px-3 py-2 rounded-lg text-sm ${filter === 'all' ? 'bg-finance-600/20 text-finance-300' : 'text-slate-400'}`}>All stocks</button>
          <button onClick={() => {setFilter('watchlist'); setPage(1)}} className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1 ${filter === 'watchlist' ? 'bg-amber-400/10 text-amber-300' : 'text-slate-400'}`}><Star size={14}/> Watchlist</button>
        </div>
        <div className="flex items-center gap-1 glass rounded-xl p-1"><button onClick={() => setView('grid')} className={`p-2 rounded-lg ${view === 'grid' ? 'bg-finance-600/20 text-finance-300' : 'text-slate-400'}`}><LayoutGrid size={18}/></button><button onClick={() => setView('table')} className={`p-2 rounded-lg ${view === 'table' ? 'bg-finance-600/20 text-finance-300' : 'text-slate-400'}`}><List size={18}/></button></div>
      </div>

      {filtered.length === 0 ? <div className="glass-card p-12 text-center text-slate-400"><Star size={32} className="mx-auto mb-3 opacity-40"/><p className="font-medium">{filter === 'watchlist' ? 'Your watchlist is empty' : `No results for “${search}”`}</p><p className="text-xs text-slate-500 mt-1">Open a stock and tap Watchlist to keep it here.</p></div> : view === 'grid' ? <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{paginated.map((s) => <StockCard key={s.symbol} stock={s} watchlist={watchlist} onWatchlistChange={setWatchlist}/>)}</div> : <StockTable stocks={paginated} />}

      {totalPages > 1 && <div className="flex items-center justify-center gap-2 mt-8"><button onClick={() => setPage(Math.max(1, safePage - 1))} disabled={safePage === 1} className="btn-ghost !py-2 !px-3 text-sm">← Prev</button>{[...Array(Math.min(totalPages, 7))].map((_, i) => <button key={i} onClick={() => setPage(i + 1)} className={`w-9 h-9 rounded-lg text-sm font-medium ${i + 1 === safePage ? 'bg-finance-600 text-white' : 'glass text-slate-400'}`}>{i + 1}</button>)}<button onClick={() => setPage(Math.min(totalPages, safePage + 1))} disabled={safePage === totalPages} className="btn-ghost !py-2 !px-3 text-sm">Next →</button></div>}
    </div>
  );
};
export default Home;
