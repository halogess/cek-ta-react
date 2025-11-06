import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, role } = useSelector((state) => state.user);
  const accessToken = localStorage.getItem('access_token');

  console.log('🔒 ProtectedRoute check:', { isAuthenticated, role, hasToken: !!accessToken, requiredRole });

  if (!isAuthenticated || !accessToken) {
    console.log('❌ Not authenticated, redirecting to login');
    return <Navigate to="/" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    console.log('❌ Role mismatch, redirecting to login');
    return <Navigate to="/" replace />;
  }

  console.log('✅ Access granted');
  return children;
}
