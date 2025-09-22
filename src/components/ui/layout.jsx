// src/components/ui/Layout.jsx
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Menu, Bell } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex"
            style={{ fontFamily: `Inter, "Noto Sans", sans-serif` }}
        >
            {/* Desktop Sidebar (fixed + static) */}
            <div className="hidden lg:block">
                <div className="fixed inset-y-0 left-0 w-72">
                    <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                </div>
            </div>

            {/* Mobile Sidebar Drawer */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 flex lg:hidden">
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black/40"
                        onClick={() => setSidebarOpen(false)}
                    />
                    {/* Sidebar Panel */}
                    <div className="relative z-50 w-64 bg-white shadow-lg">
                        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex flex-col flex-1 min-w-0 z-10 lg:ml-72">
                {/* Mobile Navbar */}
                <div className="sticky top-0 z-30 p-4 border-b lg:hidden bg-white/95 backdrop-blur-xl border-slate-200/60 flex justify-between items-center">
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                        <Menu className="w-5 h-5" />
                    </Button>
                    <h1 className="text-lg font-semibold capitalize">
                        {location.pathname.replace("/", "") || "Dashboard"}
                    </h1>
                    <Button variant="ghost" size="icon">
                        <Bell className="w-5 h-5" />
                    </Button>
                </div>

                {/* Page Content */}
                <main className="flex-1 ">
                    <div className="max-w-6xl p-4 mx-auto lg:p-8">{children}</div>
                </main>
            </div>
        </div>
    );
}
