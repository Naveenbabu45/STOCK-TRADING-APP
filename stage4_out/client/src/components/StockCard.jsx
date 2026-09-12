import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import WatchlistButton from './WatchlistButton';

const fmt = (n) => Number(n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const StockCard = ({ stock, watchlist = [], onWatchlistChange }) => {
  const change = stock.changePercent ?? 0;
  const isUp = change >= 0;
  const active = watchlist.includes(stock.symbol);
  return (
    <div className="glass-card p-5 group hover:border-finance-500/40 hover:shadow-finance-600/10 transition-all duration-300 hover:-translate-y-1 animate-slide-up">
      <div className="flex items-start justify-between mb-3">
        <Link to={`/stock/${stock.symbol}`} className="min-w-0">
          <div className="flex items-center gap-2"><span className="text-lg font-bold text-white tracking-tight">{stock.symbol}</span><span className="badge bg-white/5 text-slate-400">{stock.stockExchange || 'NASDAQ'}</span></div>
          <p className="text-sm text-slate-400 mt-0.5 truncate">{stock.name}</p>
        </Link>
        <div className="flex items-center gap-2"><WatchlistButton symbol={stock.symbol} initialActive={active} compact onChange={(_, list) => onWatchlistChange?.(list)}/><div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isUp ? 'bg-gain/10 text-gain' : 'bg-loss/10 text-loss'}`}>{isUp ? <TrendingUp size={18}/> : <TrendingDown size={18}/>}</div></div>
      </div>
      <Link to={`/stock/${stock.symbol}`} className="block"><div className="flex items-end justify-between"><div><p className="text-2xl font-bold text-white font-mono">${fmt(stock.price)}</p><p className={`text-sm font-medium ${isUp ? 'text-gain' : 'text-loss'}`}>{isUp ? '+' : ''}{change}%</p></div><div className="flex items-center gap-1 text-finance-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">Trade <ArrowUpRight size={14}/></div></div></Link>
    </div>
  );
};
export default StockCard;
