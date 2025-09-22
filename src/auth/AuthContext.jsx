// src/auth/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || "/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("token") || sessionStorage.getItem("token") || null
  );
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  // Fetch current user if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return setLoading(false);

      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Invalid or expired token");

        const data = await res.json();
        setUser(data);
        setAuthError("");
      } catch (err) {
        console.error("Auth fetch error:", err);
        logout(); // Clear invalid token
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  // 🔹 Login with "remember me" option
  const login = async (email, password, remember = true) => {
    setAuthError("");
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      // Save token based on remember flag
      if (remember) {
        localStorage.setItem("token", data.token);
        sessionStorage.removeItem("token");
      } else {
        sessionStorage.setItem("token", data.token);
        localStorage.removeItem("token");
      }
      setToken(data.token);

      // Fetch user after login
      const meRes = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      const userData = await meRes.json();
      setUser(userData);
    } catch (err) {
      console.error("Login error:", err);
      setAuthError(err.message || "Login failed");
      throw err;
    }
  };


  // Logout clears both local & session storage
  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, authError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
