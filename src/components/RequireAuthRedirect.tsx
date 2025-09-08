import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useDiscountStore } from '../stores/discountStore';

const RequireAuthRedirect = () => {
  const isAuthenticated = useAuthStore((state) => !!state.user);
  const user = useAuthStore((state) => state.user);

  const adminIsAuthenticated = useDiscountStore((state) => state.isAdminAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const protectedRoutes = ['/booking', '/payment', '/session', '/admin', '/householdForm'];
    const isProtectedRoute = protectedRoutes.some((route) =>
      location.pathname.startsWith(route)
    );

    if (location.pathname.startsWith('/admin')) {
      if (isAuthenticated && user?.role !== 'admin') {
        navigate('/', { replace: true });
        return;
      }
      if (adminIsAuthenticated && user?.role === 'admin') {
        return; // allow
      }
      return; // let admin login form show
    }

    if (!isAuthenticated && isProtectedRoute) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, adminIsAuthenticated, user?.role, location.pathname, navigate]);

  return null;
};

export default RequireAuthRedirect;