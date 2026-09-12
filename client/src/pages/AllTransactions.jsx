import { useState, useEffect, useCallback } from 'react';
import { Receipt, Search, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import axiosInstance from '../components/axiosInstance';
import { useGeneralContext } from '../context/GeneralContext';
import Loading from '../components/Loading';

const fmt = (n) =>
  Number(n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const AllTransactions = () => {
  const { showToast } = useGeneralContext();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/transactions');
      setTransactions(data || []);
    } catch {
      showToast('Failed to load transactions', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.paymentMode?.toLowerCase().includes(search.toLowerCase()) ||
      tx.type?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || (tx.type || '').toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <Loading label="Loading transactions…" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Receipt size={24} className="text-finance-400" /> Transactions
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">Platform transaction history and payment activity</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by type or payment method…"
            className="glass-input pl-11"
          />
        </div>
        <div className="flex items-center gap-1 glass rounded-xl p-1">
          {['all', 'credit', 'debit'].map((value) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                filter === value ? 'bg-finance-600/20 text-finance-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-400">
          <Wallet size={40} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">No transactions found</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Payment Mode</th>
                  <th className="px-5 py-3 font-medium text-right">Amount</th>
                  <th className="px-5 py-3 font-medium text-right">Date</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx) => {
                  const isCredit = (tx.type || '').toLowerCase() === 'credit' || (tx.type || '').toLowerCase() === 'deposit';
                  return (
                    <tr key={tx._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 font-semibold text-white">
                          {isCredit ? <ArrowRightUp size={16} className="text-gain" /> : <ArrowDownRight size={16} className="text-loss" />}
                          {tx.type || 'Transaction'}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-300">{tx.paymentMode || 'Wallet'}</td>
                      <td className={`px-5 py-4 text-right font-mono ${isCredit ? 'text-gain' : 'text-loss'}`}>
                        {isCredit ? '+' : '-'}${fmt(tx.amount)}
                      </td>
                      <td className="px-5 py-4 text-right text-slate-400">{tx.time ? new Date(tx.time).toLocaleDateString() : 'N/A'}</td>
                      <td className="px-5 py-4">
                        <span className={`badge ${isCredit ? 'bg-gain/10 text-gain' : 'bg-loss/10 text-loss'}`}>
                          {tx.status || 'Completed'}
                        </span>
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

export default AllTransactions;
