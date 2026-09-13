import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axiosInstance from '../components/axiosInstance';

const GeneralContext = createContext();

export const useGeneralContext = () => {
  const ctx = useContext(GeneralContext);
  if (!ctx) throw new Error('useGeneralContext must be used within GeneralProvider');
  return ctx;
};

export const GeneralProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [balance, setBalance] = useState(0);
  const [portfolio, setPortfolio] = useState([]);
  const [theme, setTheme] = useState('dark');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Toast helper
  const showToast = useCallback((message, type = 'info') => {
  setToast({ message, type, id: Date.now() });
  setTimeout(() => setToast(null), 3500);
}, []);

  // Restore session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setToken(storedToken);
        setIsAuthenticated(true);
        setBalance(parsed.balance ?? 0);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const login = (tokenValue, userData) => {
    localStorage.setItem('token', tokenValue);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(tokenValue);
    setUser(userData);
    setIsAuthenticated(true);
    setBalance(userData.balance ?? 0);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setBalance(0);
    setPortfolio([]);
  };

  const updateUser = (updated) => {
    const merged = { ...user, ...updated };
    setUser(merged);
    localStorage.setItem('user', JSON.stringify(merged));
    if (updated.balance !== undefined) setBalance(updated.balance);
  };

  const refreshProfile = async () => {
    try {
      const { data } = await axiosInstance.get('/users/profile');
      updateUser(data);
      return data;
    } catch (err) {
      return null;
    }
  };

  const value = {
    user,
    token,
    isAuthenticated,
    balance,
    portfolio,
    setPortfolio,
    setBalance,
    theme,
    setTheme,
    loading,
    toast,
    showToast,
    login,
    logout,
    updateUser,
    refreshProfile,
  };

  return <GeneralContext.Provider value={value}>{children}</GeneralContext.Provider>;
};

export default GeneralContext;
