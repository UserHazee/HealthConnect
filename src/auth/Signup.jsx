import React, { useState } from "react";
import { NavbarSignup } from "../components/navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { LeastButton, PrimaryButton } from "../components/button/Button";
import { Link } from "react-router-dom";


export default function Register() {
    let navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Registration failed");
                return;
            }

            alert("Registration successful! Please log in.");
            navigate("/login");
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Try again later.");
        }
    };
    return (
        <div
            className="relative flex flex-col min-h-screen overflow-x-hidden bg-white"
        >
            <NavbarSignup />
            {/* MAIN */}
            <main className="flex-1 mt-16">
                <section className="flex min-h-[calc(100vh-68px)] items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-md space-y-8">
                        <LeastButton onClick={() => navigate("/login")}>&lt;</LeastButton>
                        {/* Header */}
                        <div>
                            <h2 className="mt-6 text-3xl font-bold tracking-tight text-center text-gray-900">
                                Create a new account
                            </h2>
                            <p className="mt-2 text-sm text-center text-gray-600">
                                Or{" "}
                                <Link to="/login">
                                    <button
                                        href="#"
                                        className="cursor-pointer font-medium text-[var(--primary-color)] hover:text-blue-500"
                                    >
                                        sign in to your account
                                    </button>
                                </Link>
                            </p>
                        </div>

                        {/* Social Buttons */}
                        <div className="space-y-4">
                            <button className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white py-3 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                        fillRule="evenodd"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                        fillRule="evenodd"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                        fill="#FBBC05"
                                        fillRule="evenodd"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                        fillRule="evenodd"
                                    />
                                </svg>
                                <span>Sign up with Google</span>
                            </button>

                            <button className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white py-3 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2">
                                <svg className="w-5 h-5" fill="#1877F2" fillRule="evenodd" viewBox="0 0 24 24">
                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                </svg>
                                <span>Sign up with Facebook</span>
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="flex-shrink mx-4 text-sm text-gray-500">
                                Or continue with
                            </span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="p-2 text-sm text-red-600 bg-red-100 rounded-md">
                                {error}
                            </div>
                        )}


                        {/* Form */}
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Name */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Full Name
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        autoComplete="name"
                                        placeholder="John Doe"
                                        required
                                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-[var(--primary-color)] focus:outline-none focus:ring-[var(--primary-color)] sm:text-sm"
                                    />
                                </div>
                            </div>
                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email address
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        required
                                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-[var(--primary-color)] focus:outline-none focus:ring-[var(--primary-color)] sm:text-sm"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        required
                                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-[var(--primary-color)] focus:outline-none focus:ring-[var(--primary-color)] sm:text-sm"
                                    />
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label
                                    htmlFor="confirm-password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Confirm Password
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="password"
                                        name="confirm-password"
                                        id="confirm-password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        required
                                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-[var(--primary-color)] focus:outline-none focus:ring-[var(--primary-color)] sm:text-sm"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    className="cursor-pointer group relative flex w-full justify-center rounded-md bg-[#1193d4] py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#1193d4] focus:ring-offset-2"
                                >
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    </span>
                                    Create Account
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </main>
        </div>
    );
}