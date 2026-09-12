import { useState, useEffect, useCallback, useMemo } from 'react';
import { History as HistoryIcon, Receipt, ClipboardList, Search, Filter } from 'lucide-react';
import axiosInstance from '../components/axiosInstance';
import { useGeneralContext } from '../context/GeneralContext';
import OrderCard from '../components/OrderCard';
import TransactionCard from '../components/TransactionCard';
import Loading from '../components/Loading';

const History = () => {
  const { showToast } = useGeneralContext();
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersRes, txRes] = await Promise.all([
        axiosInstance.get('/orders/user'),
        axiosInstance.get('/transactions/user'),
      ]);
      setOrders(ordersRes.data || []);
      setTransactions(txRes.data || []);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to load history', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const filteredOrders = useMemo(() => orders.filter((o) => {
    const matchesQuery = !query || `${o.symbol} ${o.name}`.toLowerCase().includes(query.toLowerCase());
    const matchesType = type === 'all' || o.orderType?.toLowerCase() === type;
    return matchesQuery && matchesType;
  }), [orders, query, type]);

  const filteredTransactions = useMemo(() => transactions.filter((t) => {
    const matchesQuery = !query || `${t.symbol || ''} ${t.type || ''}`.toLowerCase().includes(query.toLowerCase());
    const matchesType = type === 'all' || t.type?.toLowerCase() === type;
    return matchesQuery && matchesType;
  }), [transactions, query, type]);

  const resetFilters = () => { setQuery(''); setType('all'); };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.18em] text-finance-400 font-semibold mb-2">Account activity</p>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><HistoryIcon size={24} className="text-finance-400" /> History</h1>
        <p className="text-sm text-slate-400 mt-1">Review executed orders and wallet activity in one place.</p>
      </div>

      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search symbol or transaction type…" className="glass-input pl-10" />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-500 hidden sm:block" />
            <select value={type} onChange={(e) => setType(e.target.value)} className="glass-input !w-auto min-w-[150px]">
              <option value="all">All activity</option>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
            </select>
            {(query || type !== 'all') && <button onClick={resetFilters} className="btn-ghost !py-3 text-sm">Clear</button>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 glass rounded-xl p-1 w-fit">
        <button onClick={() => setTab('orders')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${tab === 'orders' ? 'bg-finance-600/20 text-finance-300' : 'text-slate-400 hover:text-slate-200'}`}><ClipboardList size={16} /> Orders ({filteredOrders.length})</button>
        <button onClick={() => setTab('transactions')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${tab === 'transactions' ? 'bg-finance-600/20 text-finance-300' : 'text-slate-400 hover:text-slate-200'}`}><Receipt size={16} /> Transactions ({filteredTransactions.length})</button>
      </div>

      {loading ? <Loading label="Loading account activity…" /> : tab === 'orders' ? (
        filteredOrders.length === 0 ? <EmptyState icon={ClipboardList} title="No matching orders" text="Executed trades will appear here." /> : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{filteredOrders.map((o) => <OrderCard key={o._id} order={o} />)}</div>
      ) : filteredTransactions.length === 0 ? (
        <EmptyState icon={Receipt} title="No matching transactions" text="Wallet and trading transactions will appear here." />
      ) : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{filteredTransactions.map((t) => <TransactionCard key={t._id} tx={t} />)}</div>}
    </div>
  );
};

const EmptyState = ({ icon: Icon, title, text }) => (
  <div className="glass-card p-12 text-center text-slate-400"><Icon size={40} className="mx-auto mb-3 opacity-40" /><p className="font-medium text-white">{title}</p><p className="text-sm mt-1">{text}</p></div>
);

export default History;
