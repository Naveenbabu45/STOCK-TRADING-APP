import { useState } from 'react';
import { User as UserIcon, Mail, Wallet, Shield, Save, AlertCircle, TrendingUp } from 'lucide-react';
import axiosInstance from '../components/axiosInstance';
import { useGeneralContext } from '../context/GeneralContext';

const fmt = (n) =>
  Number(n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const Profile = () => {
  const { user, updateUser, showToast } = useGeneralContext();
  const [form, setForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const { data } = await axiosInstance.put('/users/profile', form);
      updateUser(data);
      showToast('Profile updated successfully', 'success');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
      showToast('Update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-8">Profile</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="glass-card p-6 text-center h-fit">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-finance-500 to-finance-700 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            {(user?.username || 'U').charAt(0).toUpperCase()}
          </div>
          <h2 className="text-lg font-bold text-white">{user?.username}</h2>
          <p className="text-sm text-slate-400">{user?.email}</p>

          <div className="mt-4 flex justify-center">
            <span className="badge bg-finance-600/15 text-finance-300">
              {user?.usertype === 'admin' ? (
                <>
                  <Shield size={12} /> Administrator
                </>
              ) : (
                <>
                  <UserIcon size={12} /> Trader
                </>
              )}
            </span>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 space-y-3 text-left">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400 flex items-center gap-2">
                <Wallet size={14} /> Balance
              </span>
              <span className="text-white font-mono font-semibold">${fmt(user?.balance)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400 flex items-center gap-2">
                <TrendingUp size={14} /> Account
              </span>
              <span className="text-gain font-medium">Active</span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-white mb-6">Edit Profile</h2>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-loss/10 border border-loss/20 text-loss text-sm mb-5 animate-slide-down">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Username</label>
                <div className="relative">
                  <UserIcon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    className="glass-input pl-11"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="glass-input pl-11"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Account Type</label>
                <div className="glass-input flex items-center px-4 py-3 text-slate-400 capitalize">
                  <Shield size={18} className="mr-2 text-slate-500" />
                  {user?.usertype || 'user'}
                  <span className="ml-auto text-xs text-slate-500">Cannot be changed</span>
                </div>
              </div>

              <button type="submit" disabled={saving} className="btn-primary">
                <Save size={16} /> {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
