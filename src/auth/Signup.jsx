import React, { useState } from "react";
import { NavbarSignup } from "../components/navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { LeastButton } from "../components/button/Button";
import { Link } from "react-router-dom";

export default function Register() {
    let navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false); // 👁 state
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validatePassword = (pwd) => {
        if (pwd.length < 8) return "Password must be at least 8 characters long";
        if (!/[0-9]/.test(pwd)) return "Password must contain at least one number";
        if (!/[!@#$%^&*]/.test(pwd)) return "Password must contain at least one symbol";
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // check confirm password
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // check weak password
        const pwdError = validatePassword(password);
        if (pwdError) {
            setError(pwdError);
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                // backend duplicate email handling
                if (data.message && data.message.includes("Email already exists")) {
                    setError("Email already exists. Please use another one.");
                } else {
                    setError(data.message || "Registration failed. Try again.");
                }
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
        <div className="relative flex flex-col min-h-screen overflow-x-hidden bg-white">
            <NavbarSignup />
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
                                        className="cursor-pointer font-medium text-[var(--primary-color)] hover:text-blue-500"
                                    >
                                        sign in to your account
                                    </button>
                                </Link>
                            </p>
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
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="John Doe"
                                        required
                                        className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-[var(--primary-color)] focus:outline-none focus:ring-[var(--primary-color)] sm:text-sm"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        required
                                        className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-[var(--primary-color)] focus:outline-none focus:ring-[var(--primary-color)] sm:text-sm"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 placeholder-gray-400 shadow-sm focus:border-[var(--primary-color)] focus:outline-none focus:ring-[var(--primary-color)] sm:text-sm"
                                    />
                                    {/* 👁 Toggle */}
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 flex items-center text-gray-500 right-3"
                                    >
                                        {showPassword ? "🙈" : "👁"}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirm-password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 placeholder-gray-400 shadow-sm focus:border-[var(--primary-color)] focus:outline-none focus:ring-[var(--primary-color)] sm:text-sm"
                                    />
                                    {/* 👁 Toggle */}
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 flex items-center text-gray-500 right-3"
                                    >
                                        {showConfirmPassword ? "🙈" : "👁"}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <div>
                                <button
                                    type="submit"
                                    className="cursor-pointer group relative flex w-full justify-center rounded-md bg-[#1193d4] py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#1193d4] focus:ring-offset-2"
                                >
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
