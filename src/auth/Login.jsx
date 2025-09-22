// src/auth/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import { NavbarLogin } from "../components/navbar/Navbar";
import { LeastButton } from "../components/button/Button";

export default function Signin() {
  const { login, authError } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password, rememberMe);
      navigate("/dashboard"); // Redirect after successful login
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };
  // src/auth/Login.jsx



  return (
    <div
      className="relative flex min-h-screen flex-col bg-white overflow-x-hidden"
    >
      <NavbarLogin />
      {/* MAIN */}
      <main className="flex-1 mt-16">
        <section className="flex min-h-[calc(100vh-68px)] items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <LeastButton onClick={() => navigate("/")}>&lt;</LeastButton>
            <div>
              <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                Sign in to your account
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Or{" "}
                <button
                  onClick={() => navigate("/register")}
                  className="font-medium text-[#1193d4] hover:text-blue-500"
                >
                  create a new account
                </button>
              </p>
            </div>

            <button
              type="button"
              className="group relative flex w-full justify-center items-center gap-3 rounded-md border border-gray-300 bg-white py-3 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1193d4] focus:ring-offset-2 transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 48 48">
                <path d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" fill="#FFC107"></path>
                <path d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" fill="#FF3D00"></path>
                <path d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" fill="#4CAF50"></path>
                <path d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.089,5.571l6.19,5.238C42.022,35.244,44,30.038,44,24C44,22.659,43.862,21.35,43.611,20.083z" fill="#1976D2"></path>
              </svg>
              Sign in with Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gray-100 px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="mt-8 space-y-6">
              {authError && (
                <p className="text-center text-sm text-red-500">{authError}</p>
              )}

              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Email address"
                    className="relative block w-full rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-[#1193d4] focus:ring-[#1193d4] sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Password"
                    className="relative block w-full rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-[#1193d4] focus:ring-[#1193d4] sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#1193d4] focus:ring-[#1193d4]"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-[#1193d4] hover:text-blue-500"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer group relative flex w-full justify-center rounded-md bg-[#1193d4] py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#1193d4] focus:ring-offset-2"
                >
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  </span>
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
