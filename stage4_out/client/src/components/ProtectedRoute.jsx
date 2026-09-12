import { Navigate, useLocation } from 'react-router-dom';
import { useGeneralContext } from '../context/GeneralContext';
import Loading from './Loading';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, loading, user } = useGeneralContext();
  const location = useLocation();

  if (loading) return <Loading fullScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.usertype !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
