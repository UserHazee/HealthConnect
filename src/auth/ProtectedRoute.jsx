// src/auth/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading...
      </div>
    );

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
