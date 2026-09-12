import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';

const fmt = (n) =>
  Number(n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const StockTable = ({ stocks = [], loading = false }) => {
  if (loading) {
    return (
      <div className="glass-card overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-white/5">
            <div className="shimmer h-5 w-16 rounded" />
            <div className="shimmer h-4 w-32 rounded flex-1" />
            <div className="shimmer h-4 w-20 rounded" />
            <div className="shimmer h-4 w-24 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!stocks.length) {
    return (
      <div className="glass-card p-10 text-center text-slate-400">
        No stocks found.
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-slate-400 text-xs uppercase tracking-wider">
              <th className="px-5 py-3 font-medium">Symbol</th>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium text-right">Price</th>
              <th className="px-5 py-3 font-medium text-right">Change</th>
              <th className="px-5 py-3 font-medium text-right">Exchange</th>
              <th className="px-5 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((s) => {
              const change = s.changePercent ?? 0;
              const isUp = change >= 0;
              return (
                <tr
                  key={s._id || s.symbol}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-5 py-4">
                    <Link to={`/stock/${s.symbol}`} className="font-bold text-white hover:text-finance-300">
                      {s.symbol}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-slate-300 max-w-[200px] truncate">{s.name}</td>
                  <td className="px-5 py-4 text-right font-mono text-white">${fmt(s.price)}</td>
                  <td className="px-5 py-4 text-right">
                    <span
                      className={`inline-flex items-center gap-1 font-medium ${
                        isUp ? 'text-gain' : 'text-loss'
                      }`}
                    >
                      {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {isUp ? '+' : ''}
                      {change}%
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right text-slate-400">{s.stockExchange || 'NASDAQ'}</td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      to={`/stock/${s.symbol}`}
                      className="text-finance-400 hover:text-finance-300 font-medium"
                    >
                      Trade →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockTable;
