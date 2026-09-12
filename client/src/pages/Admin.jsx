import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Users as UsersIcon,
  ClipboardList,
  Receipt,
  TrendingUp,
  ArrowRight,
  DollarSign,
  Activity,
} from 'lucide-react';
import axiosInstance from '../components/axiosInstance';
import { useGeneralContext } from '../context/GeneralContext';
import Loading from '../components/Loading';

const fmt = (n) =>
  Number(n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const Admin = () => {
  const { showToast } = useGeneralContext();
  const [stats, setStats] = useState({ users: 0, orders: 0, transactions: 0, volume: 0 });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersRes, txRes] = await Promise.all([
        axiosInstance.get('/orders'),
        axiosInstance.get('/transactions'),
      ]);
      const orders = ordersRes.data || [];
      const txs = txRes.data || [];
      const volume = txs.reduce((sum, t) => sum + (t.amount || 0), 0);
      setStats({
        users: new Set(orders.map((o) => o.user)).size,
        orders: orders.length,
        transactions: txs.length,
        volume,
      });
    } catch {
      showToast('Failed to load admin stats', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) return <Loading label="Loading admin dashboard…" />;

  const cards = [
    { label: 'Total Users', value: stats.users, icon: UsersIcon, to: '/admin/users', color: 'text-finance-400' },
    { label: 'Total Orders', value: stats.orders, icon: ClipboardList, to: '/admin/orders', color: 'text-gain' },
    { label: 'Transactions', value: stats.transactions, icon: Receipt, to: '/admin/transactions', color: 'text-amber-400' },
    { label: 'Trade Volume', value: `$${fmt(stats.volume)}`, icon: DollarSign, to: '/admin/transactions', color: 'text-finance-300' },
  ];

  const links = [
    { label: 'Manage Users', desc: 'View all registered traders', icon: UsersIcon, to: '/admin/users' },
    { label: 'View Orders', desc: 'Monitor all buy/sell orders', icon: ClipboardList, to: '/admin/orders' },
    { label: 'Transactions', desc: 'Review platform transaction history', icon: Receipt, to: '/admin/transactions' },
    { label: 'Stock Charts', desc: 'Analyze stock price movements', icon: TrendingUp, to: '/admin/charts' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Shield size={24} className="text-finance-400" /> Admin Dashboard
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">Platform overview and management</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="stat-card">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">{c.label}</p>
              <c.icon size={18} className={c.color} />
            </div>
            <p className="text-2xl font-bold text-white font-mono mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Activity size={18} className="text-finance-400" /> Management
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {links.map((l) => (
          <Link
            key={l.label}
            to={l.to}
            className="glass-card p-5 group hover:border-finance-500/30 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-11 h-11 rounded-xl bg-finance-600/15 flex items-center justify-center text-finance-400 mb-3">
              <l.icon size={22} />
            </div>
            <h3 className="font-semibold text-white mb-1">{l.label}</h3>
            <p className="text-xs text-slate-400">{l.desc}</p>
            <div className="mt-3 text-finance-400 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Open <ArrowRight size={14} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Admin;
