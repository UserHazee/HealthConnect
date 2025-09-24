import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

export default function PrivateRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading...
      </div>
    );

  // keep this important security check
  if (!user) return <Navigate to="/login" replace />;

  // If AuthContext doesn't provide isAuthenticated, fallback to !!user
  const allowed = typeof isAuthenticated === "boolean" ? isAuthenticated : !!user;

  // <-- IMPORTANT: return the JSX
  return allowed ? children : <Navigate to="/login" replace />;
}
