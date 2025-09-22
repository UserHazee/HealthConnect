import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    ChevronRight,
    X,
    Menu,
    Plus,
    Bell,
    User,
    Calendar,
    FolderOpen,
    Settings as SettingsIcon,
} from "lucide-react";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
    const location = useLocation();

    const navigationItems = [
        { label: "Dashboard", path: "/dashboard", icon: User },
        { label: "Appointments", path: "/appointments", icon: Calendar },
        { label: "Appointment_History", path: "/appointment_history", icon: FolderOpen },
        { label: "Settings", path: "/settings", icon: SettingsIcon },
    ];

    return (
        <>
            {/* Overlay (for mobile when open) */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar drawer */}
            <div
                className={`
          lg:static lg:inset-auto lg:z-auto
          fixed inset-y-0 left-0 z-50 
          w-72 bg-white/95 backdrop-blur-xl border-r border-slate-200/60 shadow-xl
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        `}
            >
                <div className="flex flex-col h-screen">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div
                                        className="w-12 h-12 bg-center bg-cover shadow-lg rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 ring-2 ring-white"
                                        style={{
                                            backgroundImage: 'url("https://images.unsplash.com/photo-1494790108755-2616b612b739?w=100&h=100&fit=crop&crop=face")'
                                        }}
                                    />
                                    <div className="absolute w-4 h-4 bg-green-500 border-2 border-white rounded-full -bottom-1 -right-1"></div>
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-800">Sophia Clark</h2>
                                    <p className="text-sm text-slate-500">Patient ID: #SC2024</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 p-4 space-y-2">
                        {navigationItems.map((item) => {
                            const active = location.pathname === item.path;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.label}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition
                                          ${active
                                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                                            : "text-slate-600 hover:bg-slate-100"
                                        }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.label.replace("_", " ")}</span>
                                    {active && <ChevronRight className="ml-auto w-4 h-4" />}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Quick Actions */}
                    <div className="p-4 border-t border-slate-100 space-y-3">
                        <Button className="w-full text-white bg-gradient-to-r from-blue-500 to-purple-500">
                            <Plus className="w-4 h-4 mr-2" /> Book Appointment
                        </Button>
                        <Button variant="outline" className="w-full">
                            <Bell className="w-4 h-4 mr-2" /> Notifications
                        </Button>
                    </div>
                </div>
            </div>

            {/* Top Navbar for mobile */}
            <div className="sticky top-0 z-30 p-4 border-b lg:hidden bg-white/95 backdrop-blur-xl border-slate-200/60 flex justify-between items-center">
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                    <Menu className="w-5 h-5" />
                </Button>
                <h1 className="text-lg font-semibold capitalize">
                    {location.pathname.replace("/", "").replace("_", " ") || "Dashboard"}
                </h1>
                <Button variant="ghost" size="icon">
                    <Bell className="w-5 h-5" />
                </Button>
            </div>
        </>
    );
}
