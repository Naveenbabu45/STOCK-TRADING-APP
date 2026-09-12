import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { GeneralProvider, useGeneralContext } from './context/GeneralContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Loading from './components/Loading';
import Login from './components/Login';
import Register from './components/Register';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import History from './pages/History';
import Profile from './pages/Profile';
import StockChart from './pages/StockChart';
import Admin from './pages/Admin';
import Users from './pages/Users';
import AllOrders from './pages/AllOrders';
import AllTransactions from './pages/AllTransactions';
import AdminStockChart from './pages/AdminStockChart';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Toast renderer
const Toast = () => {
  const { toast } = useGeneralContext();
  if (!toast) return null;

  const config = {
    success: { icon: CheckCircle2, color: 'text-gain', border: 'border-gain/30', bg: 'bg-gain/10' },
    error: { icon: XCircle, color: 'text-loss', border: 'border-loss/30', bg: 'bg-loss/10' },
    info: { icon: Info, color: 'text-finance-400', border: 'border-finance-500/30', bg: 'bg-finance-600/10' },
  };
  const c = config[toast.type] || config.info;
  const Icon = c.icon;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className={`glass-card px-5 py-4 flex items-center gap-3 ${c.border} min-w-[260px]`}>
        <Icon size={20} className={c.color} />
        <span className="text-sm text-white font-medium">{toast.message}</span>
      </div>
    </div>
  );
};

// 404 page
const NotFound = () => (
  <div className="min-h-[70vh] flex items-center justify-center px-4">
    <div className="text-center animate-scale-in">
      <p className="text-8xl font-extrabold text-gradient">404</p>
      <h1 className="text-2xl font-bold text-white mt-4">Page not found</h1>
      <p className="text-slate-400 mt-2 mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link to="/dashboard" className="btn-primary">
        Back to Dashboard
      </Link>
    </div>
  </div>
);

// Layout with navbar (for authenticated / internal pages)
const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
  </div>
);

// Auth pages (no navbar)
const AuthLayout = ({ children }) => <div className="min-h-screen">{children}</div>;

const AppRoutes = () => {
  const { loading } = useGeneralContext();

  if (loading) return <Loading fullScreen />;

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout>
              <Register />
            </AuthLayout>
          }
        />

        {/* User */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/portfolio"
          element={
            <ProtectedRoute>
              <Layout>
                <Portfolio />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <Layout>
                <History />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/stock/:symbol"
          element={
            <ProtectedRoute>
              <Layout>
                <StockChart />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <Layout>
                <Admin />
              </Layout>
            </ProtectedRoute>
          }
        />
       
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly>
              <Layout>
                <Users />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute adminOnly>
              <Layout>
                <AllOrders />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/transactions"
          element={
            <ProtectedRoute adminOnly>
              <Layout>
                <AllTransactions />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/charts"
          element={
            <ProtectedRoute adminOnly>
              <Layout>
                <AdminStockChart />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="/404" element={<Layout><NotFound /></Layout>} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      <Toast />
    </>
  );
};

const App = () => (
  <GeneralProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </GeneralProvider>
);

export default App;
