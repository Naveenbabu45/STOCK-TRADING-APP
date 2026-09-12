import { useState, useEffect, useCallback } from 'react';
import { ClipboardList, Search, Check, X, Clock } from 'lucide-react';
import axiosInstance from '../components/axiosInstance';
import { useGeneralContext } from '../context/GeneralContext';
import Loading from '../components/Loading';

const fmt = (n) =>
  Number(n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const statusBadge = {
  pending: 'bg-amber-500/10 text-amber-400',
  completed: 'bg-gain/10 text-gain',
  cancelled: 'bg-loss/10 text-loss',
  rejected: 'bg-loss/10 text-loss',
};

const AllOrders = () => {
  const { showToast } = useGeneralContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | buy | sell
  const [updating, setUpdating] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/orders');
      setOrders(data || []);
    } catch {
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      const { data } = await axiosInstance.put(`/orders/${id}`, { orderStatus: status });
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, ...data, orderStatus: status } : o)));
      showToast(`Order ${status}`, 'success');
    } catch {
      showToast('Failed to update order', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.symbol?.toLowerCase().includes(search.toLowerCase()) ||
      o.name?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || (o.orderType || '').toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <Loading label="Loading orders…" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ClipboardList size={24} className="text-finance-400" /> All Orders
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">{orders.length} orders across the platform</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by symbol or name…"
            className="glass-input pl-11"
          />
        </div>
        <div className="flex items-center gap-1 glass rounded-xl p-1">
          {['all', 'buy', 'sell'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                filter === f ? 'bg-finance-600/20 text-finance-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-400">
          <ClipboardList size={40} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">No orders found</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 font-medium">Symbol</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium text-right">Price</th>
                  <th className="px-5 py-3 font-medium text-right">Qty</th>
                  <th className="px-5 py-3 font-medium text-right">Total</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => {
                  const status = (o.orderStatus || 'pending').toLowerCase();
                  return (
                    <tr key={o._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4">
                        <span className="font-bold text-white">{o.symbol}</span>
                        <p className="text-xs text-slate-500">{o.name}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge ${(o.orderType || '').toLowerCase() === 'buy' ? 'bg-gain/10 text-gain' : 'bg-loss/10 text-loss'}`}>
                          {o.orderType || 'BUY'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right font-mono text-white">${fmt(o.price)}</td>
                      <td className="px-5 py-4 text-right text-slate-300">{o.count}</td>
                      <td className="px-5 py-4 text-right font-mono text-white">${fmt(o.totalPrice)}</td>
                      <td className="px-5 py-4">
                        <span className={`badge ${statusBadge[status] || statusBadge.pending}`}>
                          <Clock size={11} /> {o.orderStatus || 'Pending'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => updateStatus(o._id, 'completed')}
                            disabled={updating === o._id}
                            className="p-1.5 rounded-lg bg-gain/10 text-gain hover:bg-gain/20 transition-all disabled:opacity-50"
                            title="Approve"
                          >
                            <Check size={15} />
                          </button>
                          <button
                            onClick={() => updateStatus(o._id, 'cancelled')}
                            disabled={updating === o._id}
                            className="p-1.5 rounded-lg bg-loss/10 text-loss hover:bg-loss/20 transition-all disabled:opacity-50"
                            title="Cancel"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllOrders;
