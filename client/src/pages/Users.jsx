import { useState, useEffect, useCallback } from 'react';
import { Users, Search, Shield, Mail, DollarSign } from 'lucide-react';
import axiosInstance from '../components/axiosInstance';
import { useGeneralContext } from '../context/GeneralContext';
import Loading from '../components/Loading';

const fmt = (n) =>
  Number(n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const UsersPage = () => {
  const { showToast } = useGeneralContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/users');
      setUsers(data || []);
    } catch {
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = users.filter((user) => {
    const matchesSearch =
      user.username?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = role === 'all' || (user.usertype || 'user') === role;
    return matchesSearch && matchesRole;
  });

  if (loading) return <Loading label="Loading users…" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users size={24} className="text-finance-400" /> Users
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">Manage registered traders and admin accounts</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by username or email…"
            className="glass-input pl-11"
          />
        </div>

        <div className="flex items-center gap-1 glass rounded-xl p-1">
          {['all', 'admin', 'user'].map((value) => (
            <button
              key={value}
              onClick={() => setRole(value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                role === value ? 'bg-finance-600/20 text-finance-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-400">
          <Shield size={40} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">No users found</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 font-medium">Username</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium text-right">Balance</th>
                  <th className="px-5 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">{user.username}</div>
                      <div className="text-xs text-slate-500">{user.name || 'Trader'}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-300">{user.email}</td>
                    <td className="px-5 py-4">
                      <span className={`badge ${user.usertype === 'admin' ? 'bg-finance-600/10 text-finance-300' : 'bg-white/5 text-slate-300'}`}>
                        {user.usertype || 'user'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-mono text-white">${fmt(user.balance ?? 0)}</td>
                    <td className="px-5 py-4 text-slate-400">{new Date(user.createdAt || user.createdAt || Date.now()).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
