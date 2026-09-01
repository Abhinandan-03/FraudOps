import { Navigate, Outlet } from 'react-router-dom';
import { getAuthUser } from '../utils/auth';

/**
 * A wrapper component for protected routes.
 * If the user is not authenticated, they are redirected to /login.
 * Otherwise, it renders the protected child routes.
 */
export default function ProtectedRoute({ children }) {
  const isAuthenticated = !!getAuthUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}
