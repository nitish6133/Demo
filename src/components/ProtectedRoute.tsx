import { useEffect, useRef } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useLocation, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const authState = useAuthStore((s) => s.authState);

  const location = useLocation();
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (
      !hasRedirected.current &&
      (authState === "invalid" ||
        (!isAuthenticated && !user && authState !== "checking"))
    ) {
      hasRedirected.current = true; // Prevent future redirects
      if (location.pathname !== "/login") {
        navigate("/login", { replace: true, state: { from: location } });
      }
    }
  }, [authState, isAuthenticated, user, location.pathname, navigate]);

  if (authState === "checking") {
    return <div>Loading...</div>;
  }

  if (isAuthenticated && user) {
    return children;
  }

  return null;
};

export default ProtectedRoute;
