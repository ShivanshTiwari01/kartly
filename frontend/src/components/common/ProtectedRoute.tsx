import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@store/hooks';
import { ROUTES } from '@/config/routes.config';

export const ProtectedRoute = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
};
