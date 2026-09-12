import { ArrowUpRight, ArrowDownRight, Clock, CircleDollarSign } from 'lucide-react';

const fmt = (n) => Number(n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const dateFmt = (d) => d ? new Date(d).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '—';
const statusColors = { pending: 'bg-amber-500/10 text-amber-400', completed: 'bg-gain/10 text-gain', cancelled: 'bg-loss/10 text-loss', rejected: 'bg-loss/10 text-loss' };

const OrderCard = ({ order }) => {
  const isBuy = (order.orderType || '').toLowerCase() === 'buy';
  const status = (order.orderStatus || 'pending').toLowerCase();
  const realized = Number(order.realizedPnl || 0);
  return (
    <article className="glass-card p-5 animate-slide-up hover:border-white/20 transition-all">
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${isBuy ? 'bg-gain/10 text-gain' : 'bg-loss/10 text-loss'}`}>{isBuy ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}</div>
          <div className="min-w-0"><div className="flex items-center gap-2"><span className="font-bold text-white">{order.symbol}</span><span className={`badge ${isBuy ? 'bg-gain/10 text-gain' : 'bg-loss/10 text-loss'}`}>{order.orderType || 'BUY'}</span></div><p className="text-xs text-slate-400 mt-0.5 truncate">{order.name}</p></div>
        </div>
        <span className={`badge shrink-0 ${statusColors[status] || statusColors.pending}`}>{order.orderStatus || 'Pending'}</span>
      </div>
      <div className="grid grid-cols-3 gap-3 text-sm pt-3 border-t border-white/5">
        <div><p className="text-slate-500 text-xs">Execution</p><p className="text-white font-semibold font-mono">${fmt(order.price)}</p></div>
        <div><p className="text-slate-500 text-xs">Quantity</p><p className="text-white font-semibold font-mono">{order.count}</p></div>
        <div><p className="text-slate-500 text-xs">Total</p><p className="text-white font-semibold font-mono">${fmt(order.totalPrice)}</p></div>
      </div>
      {!isBuy && <div className={`mt-3 rounded-lg px-3 py-2 text-xs flex items-center gap-2 ${realized >= 0 ? 'bg-gain/5 text-gain' : 'bg-loss/5 text-loss'}`}><CircleDollarSign size={13}/> Realized P&L: {realized >= 0 ? '+' : '-'}${fmt(Math.abs(realized))}</div>}
      <p className="text-xs text-slate-500 mt-3 flex items-center gap-1"><Clock size={12} /> {dateFmt(order.createdAt)} {order.stockType ? `· ${order.stockType}` : ''}</p>
    </article>
  );
};
export default OrderCard;
