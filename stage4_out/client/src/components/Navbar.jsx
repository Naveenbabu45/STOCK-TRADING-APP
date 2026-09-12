import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  TrendingUp,
  LayoutDashboard,
  Briefcase,
  History,
  User as UserIcon,
  Shield,
  LogOut,
  Menu,
  X,
  Wallet,
} from 'lucide-react';
import { useGeneralContext } from '../context/GeneralContext';

const Navbar = () => {
  const { user, isAuthenticated, balance, logout } = useGeneralContext();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const isAdmin = user?.usertype === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? 'bg-finance-600/20 text-finance-300 border border-finance-500/30'
        : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
    }`;

  const userLinks = (
    <>
      <NavLink to="/dashboard" className={linkClass}>
        <LayoutDashboard size={16} /> Dashboard
      </NavLink>
      <NavLink to="/portfolio" className={linkClass}>
        <Briefcase size={16} /> Portfolio
      </NavLink>
      <NavLink to="/history" className={linkClass}>
        <History size={16} /> History
      </NavLink>
      <NavLink to="/profile" className={linkClass}>
        <UserIcon size={16} /> Profile
      </NavLink>
    </>
  );

  const adminLinks = (
    <>
      <NavLink to="/admin" className={linkClass} end>
        <Shield size={16} /> Admin
      </NavLink>
      <NavLink to="/admin/users" className={linkClass}>
        <UserIcon size={16} /> Users
      </NavLink>
      <NavLink to="/admin/orders" className={linkClass}>
        <History size={16} /> Orders
      </NavLink>
      <NavLink to="/admin/transactions" className={linkClass}>
        <Wallet size={16} /> Transactions
      </NavLink>
      <NavLink to="/admin/charts" className={linkClass}>
        <TrendingUp size={16} /> Charts
      </NavLink>
    </>
  );

  return (
    <header className="sticky top-0 z-40 glass border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-finance-500 to-finance-700 flex items-center justify-center shadow-lg shadow-finance-600/30 group-hover:scale-105 transition-transform">
            <TrendingUp size={20} className="text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            SB<span className="text-finance-400">Stocks</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-1">
          {isAuthenticated && (isAdmin ? adminLinks : userLinks)}
        </div>

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="glass px-3 py-1.5 rounded-lg flex items-center gap-2">
                <Wallet size={15} className="text-gain" />
                <span className="text-sm font-semibold text-white font-mono">
                  ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <button onClick={handleLogout} className="btn-ghost !py-2 !px-4 text-sm">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost !py-2 !px-4 text-sm">
                Login
              </Link>
              <Link to="/register" className="btn-primary !py-2 !px-4 text-sm">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-white/5"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-white/10 bg-finance-950/95 backdrop-blur-xl animate-slide-down">
          <div className="px-4 py-4 flex flex-col gap-1">
            {isAuthenticated && (isAdmin ? adminLinks : userLinks)}
            <div className="mt-2 pt-3 border-t border-white/10 flex items-center justify-between">
              {isAuthenticated ? (
                <>
                  <div className="glass px-3 py-1.5 rounded-lg flex items-center gap-2">
                    <Wallet size={15} className="text-gain" />
                    <span className="text-sm font-semibold text-white font-mono">
                      ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <button onClick={handleLogout} className="btn-ghost !py-2 !px-4 text-sm">
                    <LogOut size={16} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="btn-ghost !py-2 text-sm flex-1 justify-center">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="btn-primary !py-2 text-sm flex-1 justify-center">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
