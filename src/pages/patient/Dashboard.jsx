// src/pages/dashboard/Dashboard.jsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    Clock,
    User,
    History,
    MapPin,
    Phone,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Layout from "../../components/ui/layout";
import { useAuth } from "@/auth/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ✅ Fixed secureFetch - only call response.json() ONCE
const secureFetch = async (url, token, options = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            cache: "no-store",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
};

function AppointmentSkeleton() {
    return (
        <Card className="animate-pulse">
            <CardContent className="p-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                    <div className="flex-1 min-w-0 space-y-2">
                        <div className="w-24 h-3 rounded bg-slate-200" />
                        <div className="w-40 h-4 rounded bg-slate-300" />
                        <div className="w-32 h-3 rounded bg-slate-200" />
                    </div>
                    <div className="w-5 h-5 rounded bg-slate-200" />
                </div>
            </CardContent>
        </Card>
    );
}

function NextAppointmentSkeleton() {
    return (
        <Card className="mb-8 border-green-200 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50 animate-pulse">
            <CardContent className="p-6">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                    <div className="flex items-center flex-1 gap-4">
                        <div className="w-14 h-14 bg-slate-200 rounded-2xl"></div>
                        <div className="flex-1 space-y-3">
                            <div className="w-32 h-4 rounded bg-slate-200"></div>
                            <div className="w-48 h-3 rounded bg-slate-200"></div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <div className="w-4 h-4 rounded bg-slate-200"></div>
                                    <div className="w-16 h-3 rounded bg-slate-200"></div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-4 h-4 rounded bg-slate-200"></div>
                                    <div className="w-20 h-3 rounded bg-slate-200"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:text-right">
                        <div className="w-20 h-6 mb-3 rounded-full bg-slate-200"></div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-3 rounded bg-slate-200"></div>
                                <div className="w-16 h-3 rounded bg-slate-200"></div>
                            </div>
                            <div className="w-full h-2 rounded bg-slate-200"></div>
                            <div className="w-24 h-2 rounded bg-slate-200"></div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function Dashboard() {
    const { token, user, loading: authLoading } = useAuth();
    const [upcomingAppointments, setUpcomingAppointments] = useState(null);
    const [dashboardLoading, setDashboardLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false); // Separate state for refresh

    // Check if we have cached data on component mount
    useEffect(() => {
        if (user?.id) {
            const cacheKey = `appointments_${user.id}`;
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                setUpcomingAppointments(JSON.parse(cached));
                setDashboardLoading(false); // Hide skeleton immediately
                return; // Don't proceed to fetch if we have cache
            }
        }
        // If no cache, we'll fetch in the next useEffect
    }, [user?.id]);

    // Helper function to convert 12-hour to 24-hour format for proper sorting
    const convertTo24Hour = (time12h) => {
        if (!time12h) return "00:00";

        const [time, modifier] = time12h.split(/\s+/);
        let [hours, minutes] = time.split(':');

        if (hours === '12') {
            hours = '00';
        }
        if (modifier?.toUpperCase() === 'PM') {
            hours = String(parseInt(hours, 10) + 12);
        }

        return `${hours.padStart(2, '0')}:${minutes}`;
    };

    // Helper function to format appointment date
    const formatAppointmentDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());

        if (dateOnly.getTime() === todayOnly.getTime()) {
            return "Today";
        } else if (dateOnly.getTime() === tomorrowOnly.getTime()) {
            return "Tomorrow";
        } else {
            return date.toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
            });
        }
    };

    // 🎯 Logic to get next appointment and remaining appointments
    const getAppointmentData = (appointments) => {
        if (!appointments || !Array.isArray(appointments)) {
            return { nextAppointment: null, remainingAppointments: [] };
        }

        const now = new Date();

        // ✅ Keep only future appointments
        const futureAppointments = appointments.filter((appointment) => {
            const appointmentDateTime = new Date(appointment.appointment_date);
            return appointmentDateTime > now;
        });

        // ✅ Sort by soonest (ascending order)
        futureAppointments.sort((a, b) => {
            const dateA = new Date(a.appointment_date);
            const dateB = new Date(b.appointment_date);

            // Compare dates first
            if (dateA.getTime() !== dateB.getTime()) {
                return dateA - dateB; // Soonest first
            }

            // If same date, compare times
            const timeA = convertTo24Hour(a.appointment_time);
            const timeB = convertTo24Hour(b.appointment_time);
            return timeA.localeCompare(timeB);
        });

        return {
            nextAppointment: futureAppointments[0] || null,
            remainingAppointments: futureAppointments.slice(1),
        };
    };

    const fetchAppointments = useCallback(async (isRefresh = false) => {
        if (isRefresh) {
            setIsRefreshing(true);
            setDashboardLoading(true);
        }

        // Wait for auth context to finish loading
        if (authLoading) {
            console.log("Auth context still loading, waiting...");
            return;
        }

        if (!token || !user?.id) {
            console.log("No token or user ID");
            setDashboardLoading(false);
            setIsRefreshing(false);
            return;
        }
        const cacheKey = `appointments_${user.id}`;

        try {
            console.log("Fetching appointments for user:", user.id);
            const data = await secureFetch(`${API_URL}/appointments`, token);
            const appointments = data.appointments || data || [];

            setUpcomingAppointments(appointments);
            localStorage.setItem(cacheKey, JSON.stringify(appointments));

        } catch (err) {
            console.error("Error fetching appointments:", err.message);
            // Only fallback to cache if we don't have any data yet
            if (!upcomingAppointments) {
                const cached = localStorage.getItem(cacheKey);
                if (cached) {
                    setUpcomingAppointments(JSON.parse(cached));
                } else {
                    setUpcomingAppointments([]);
                }
            }
        } finally {
            setDashboardLoading(false);
            setIsRefreshing(false);
        }
    }, [token, user?.id, authLoading, upcomingAppointments]);

    // Fetch on mount only if no cached data
    useEffect(() => {
        // Only fetch if we don't have appointments AND we're still loading (meaning no cache was found)
        if (!upcomingAppointments && dashboardLoading && user?.id) {
            fetchAppointments();
        }
    }, [fetchAppointments, upcomingAppointments, dashboardLoading, user?.id]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { nextAppointment, remainingAppointments } = useMemo(() => {
        return getAppointmentData(upcomingAppointments);
    }, [upcomingAppointments]);

    const refreshAppointments = useCallback(() => {
        setDashboardLoading(true);
        fetchAppointments(true);
    }, [fetchAppointments]);
    const showLoading = dashboardLoading || isRefreshing;

    return (
        <Layout>
            <div className="mb-8 lg:mb-12">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="mb-2 text-2xl font-bold lg:text-4xl text-slate-800">
                            Good morning, {user?.first_name || 'User'}! 🌅
                        </h1>
                        <p className="text-base text-slate-600 lg:text-lg">
                            Here's your health overview for today
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-sm"
                            onClick={refreshAppointments}
                            disabled={showLoading}
                        >
                            <History className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                            {isRefreshing ? "Refreshing..." : "Refresh"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Current Status - Priority Card (Next Appointment) */}
            {dashboardLoading ? (
                <NextAppointmentSkeleton />
            ) : nextAppointment ? (
                <Card className="mb-8 border-green-200 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                            <div className="flex items-center flex-1 gap-4">
                                <div className="flex items-center justify-center shadow-lg w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl">
                                    <Clock className="text-white w-7 h-7" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="mb-1 text-lg font-semibold text-slate-800">
                                        Next: {nextAppointment.department}
                                    </h3>
                                    <p className="mb-2 text-sm text-slate-600">
                                        {nextAppointment.doctor} • {formatAppointmentDate(nextAppointment.appointment_date)} at {nextAppointment.appointment_time}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            <span>Room TBD</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Phone className="w-4 h-4" />
                                            <span>Contact clinic</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:text-right">
                                <Badge className="mb-3 text-green-700 bg-green-100 border-green-200">
                                    Scheduled
                                </Badge>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600">Status</span>
                                        <span className="font-medium text-slate-800">Confirmed</span>
                                    </div>
                                    <Progress value={100} className="h-2" />
                                    <p className="text-xs text-slate-500">Ready for appointment</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="mb-8 border-blue-200 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center shadow-lg w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl">
                                <Calendar className="text-white w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-slate-800">
                                    No upcoming appointments
                                </h3>
                                <p className="text-sm text-slate-600">
                                    Book your next appointment to stay on top of your health
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Upcoming Appointments */}
            <section className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold lg:text-2xl text-slate-800">
                        Upcoming Appointments
                    </h2>
                </div>

                <AnimatePresence mode="wait">
                    {showLoading ? (
                        <div className="grid gap-4 lg:gap-6">
                            <AppointmentSkeleton key="skeleton1" />
                            <AppointmentSkeleton key="skeleton2" />
                            <AppointmentSkeleton key="skeleton3" />
                        </div>
                    ) : !remainingAppointments || remainingAppointments.length === 0 ? (
                        <motion.p
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.1 }}
                            className="text-slate-600"
                        >
                            {nextAppointment ? "No other upcoming appointments" : "No upcoming appointments"}
                        </motion.p>
                    ) : (
                        <motion.div
                            key="appointments"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.1 }}
                            className="grid gap-4 lg:gap-6"
                        >
                            {remainingAppointments.map((appointment) => (
                                <Card
                                    key={appointment.id}
                                    className="transition-all duration-150 cursor-pointer group hover:shadow-lg hover:-translate-y-1"
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4">
                                            {/* Icon */}
                                            <div className="flex items-center justify-center w-12 h-12 text-white bg-blue-500 rounded-xl">
                                                <User className="w-6 h-6" />
                                            </div>

                                            {/* Appointment Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="mb-1 text-sm font-medium text-blue-600">
                                                    {appointment.department}
                                                </h3>
                                                <p className="mb-1 text-lg font-semibold text-slate-800">
                                                    {appointment.doctor}
                                                </p>
                                                <p className="text-sm text-slate-600">
                                                    {formatAppointmentDate(appointment.appointment_date)} - {appointment.appointment_time}
                                                </p>
                                            </div>

                                            {/* Right arrow */}
                                            <ChevronRight className="w-5 h-5 text-slate-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* Health Summary */}
            <section>
                <h2 className="mb-6 text-xl font-bold lg:text-2xl text-slate-800">
                    Health Summary
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="mb-1 text-sm font-medium text-blue-600">
                                        Total Visits
                                    </p>
                                    <p className="text-2xl font-bold text-slate-800">24</p>
                                    <p className="text-sm text-slate-500">This year</p>
                                </div>
                                <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-xl">
                                    <Calendar className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="mb-1 text-sm font-medium text-purple-600">
                                        Next Checkup
                                    </p>
                                    <p className="text-2xl font-bold text-slate-800">15</p>
                                    <p className="text-sm text-slate-500">Days away</p>
                                </div>
                                <div className="flex items-center justify-center w-12 h-12 bg-purple-500 rounded-xl">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="mb-1 text-sm font-medium text-green-600">
                                        Health Score
                                    </p>
                                    <p className="text-2xl font-bold text-slate-800">92%</p>
                                    <p className="text-sm text-slate-500">Excellent</p>
                                </div>
                                <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-xl">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </Layout>
    );
}