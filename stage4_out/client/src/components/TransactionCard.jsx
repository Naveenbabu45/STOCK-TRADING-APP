import { ArrowUpRight, ArrowDownRight, Wallet, CircleDollarSign } from 'lucide-react';
const fmt = (n) => Number(n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const TransactionCard = ({ tx }) => {
  const type = (tx.type || '').toLowerCase();
  const isCredit = ['credit', 'deposit', 'sell'].includes(type);
  const time = tx.time || tx.createdAt ? new Date(tx.time || tx.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '';
  return <article className="glass-card p-5 animate-slide-up hover:border-white/20 transition-all">
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0"><div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${isCredit ? 'bg-gain/10 text-gain' : 'bg-loss/10 text-loss'}`}>{isCredit ? <ArrowUpRight size={18}/> : <ArrowDownRight size={18}/>}</div><div className="min-w-0"><p className="font-semibold text-white capitalize truncate">{tx.type || 'Transaction'}{tx.symbol ? ` · ${tx.symbol}` : ''}</p><p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><Wallet size={11}/> {tx.paymentMode || '—'}</p></div></div>
      <div className="text-right shrink-0"><p className={`font-bold font-mono ${isCredit ? 'text-gain' : 'text-loss'}`}>{isCredit ? '+' : '-'}${fmt(tx.amount)}</p><p className="text-xs text-slate-500 mt-0.5">{time}</p></div>
    </div>
    {(tx.quantity || tx.price || tx.realizedPnl) && <div className="grid grid-cols-3 gap-3 border-t border-white/5 mt-4 pt-3 text-xs"><div><p className="text-slate-500">Quantity</p><p className="text-white font-mono mt-0.5">{tx.quantity ?? '—'}</p></div><div><p className="text-slate-500">Price</p><p className="text-white font-mono mt-0.5">{tx.price ? `$${fmt(tx.price)}` : '—'}</p></div><div><p className="text-slate-500">Realized P&L</p><p className={`font-mono mt-0.5 ${Number(tx.realizedPnl || 0) >= 0 ? 'text-gain' : 'text-loss'}`}><CircleDollarSign size={12} className="inline mr-1"/>{tx.realizedPnl == null ? '—' : `${tx.realizedPnl >= 0 ? '+' : '-'}$${fmt(Math.abs(tx.realizedPnl))}`}</p></div></div>}
  </article>;
};
export default TransactionCard;
