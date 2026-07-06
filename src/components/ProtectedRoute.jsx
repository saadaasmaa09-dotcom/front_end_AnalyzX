import { Navigate, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ProtectedRoute() {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
}