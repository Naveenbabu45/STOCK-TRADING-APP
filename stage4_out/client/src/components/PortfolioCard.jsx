import { TrendingUp, TrendingDown, Layers } from 'lucide-react';

const fmt = (n) =>
  Number(n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const PortfolioCard = ({ holding }) => {
  const value = holding.marketValue ?? (holding.currentPrice ?? holding.price ?? 0) * (holding.count ?? 0);
  const cost = holding.totalPrice ?? value;
  const pnl = value - cost;
  const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
  const isUp = pnl >= 0;

  return (
    <div className="glass-card p-5 animate-slide-up hover:border-finance-500/30 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">{holding.symbol}</span>
            <span className="badge bg-white/5 text-slate-400">{holding.stockExchange || 'NASDAQ'}</span>
          </div>
          <p className="text-sm text-slate-400 mt-0.5">{holding.name}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-finance-600/10 flex items-center justify-center text-finance-400">
          <Layers size={18} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-slate-500 text-xs">Shares</p>
          <p className="text-white font-semibold font-mono">{holding.count}</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs">Avg. Cost</p>
          <p className="text-white font-semibold font-mono">${fmt(holding.avgPrice ?? holding.price)}</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs">Current Value</p>
          <p className="text-white font-semibold font-mono">${fmt(value)}</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs">P&amp;L</p>
          <p className={`font-semibold font-mono flex items-center gap-1 ${isUp ? 'text-gain' : 'text-loss'}`}>
            {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {isUp ? '+' : ''}${fmt(pnl)} ({pnlPct.toFixed(2)}%)
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;
