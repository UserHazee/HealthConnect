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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"; // 🔧 fallback to localhost

// SECURITY MEASURES
// Add input sanitization
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    return input.replace(/[<>]/g, ''); // Basic XSS protection
};

// ✅ Fixed secureFetch - only call response.json() ONCE
const secureFetch = async (url, token, options = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            cache: "no-store",  // 🚀 prevent 304 caching
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        clearTimeout(timeoutId);
        console.log("📡 Fetch status:", response.status); // 🔧

        // ✅ Only parse once and store the result
        const data = await response.json();
        console.log("📋 API raw response:", data); // 🔧

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        // ✅ Return the already-parsed data instead of reading again
        return data;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timeout');
        }
        throw error;
    }
};

function AppointmentSkeleton() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Card className="animate-pulse">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        {/* Icon placeholder */}
                        <div className="w-12 h-12 bg-slate-200 rounded-xl" />

                        {/* Text placeholders */}
                        <div className="flex-1 min-w-0 space-y-2">
                            <div className="w-24 h-3 bg-slate-200 rounded" />
                            <div className="w-40 h-4 bg-slate-300 rounded" />
                            <div className="w-32 h-3 bg-slate-200 rounded" />
                        </div>

                        {/* Right arrow placeholder */}
                        <div className="w-5 h-5 bg-slate-200 rounded" />
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export default function Dashboard() {
    // Fixed: Import loading as authLoading to avoid conflicts
    const { token, user, loading: authLoading } = useAuth();

    // Fixed: Add back the missing upcomingAppointments state
    const [upcomingAppointments, setUpcomingAppointments] = useState(null);

    // 🚀 Create user-specific cache key
    const getCacheKey = () => {
        if (!user?.id) return null; // Changed from user?.id to user?.uid
        return `appointments_${user.id}`; // Changed from user.id to user.uid
    };

    // Fixed: Correct dashboardLoading state - should be boolean for loading status
    const [dashboardLoading, setDashboardLoading] = useState(() => {
        const cacheKey = getCacheKey();
        return cacheKey ? !localStorage.getItem(cacheKey) : true;
    });

    const [initialized, setInitialized] = useState(() => {
        const cacheKey = getCacheKey();
        return cacheKey ? !!localStorage.getItem(cacheKey) : false;
    });

    // Add refresh trigger
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Fixed: Move debug console.log AFTER state declarations
    console.log("🔍 Dashboard Auth States:", {
        token: token ? "EXISTS" : "NULL",
        user: user ? user : "NULL",
        userId: user?.id || "NO ID", // Changed from user?.id to user?.uid
        authLoading: authLoading,
        dashboardLoading: dashboardLoading
    });

    // Add better API debugging
    console.log("🔧 API URL:", API_URL);

    // 🎯 Logic to get next appointment and remaining appointments
    const getAppointmentData = (appointments) => {
        if (!appointments || !Array.isArray(appointments)) {
            console.log("No appointments array:", appointments);
            return { nextAppointment: null, remainingAppointments: [] };
        }

        const now = new Date();

        // ✅ Keep only future appointments
        const futureAppointments = appointments.filter((appointment) => {
            const appointmentDateTime = new Date(appointment.appointment_date);
            return appointmentDateTime > now;
        });

        // ✅ FIX: Sort by soonest (ascending order)
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

        console.log("🔍 Sorted future appointments:", futureAppointments.map(apt => ({
            id: apt.id,
            date: apt.appointment_date,
            time: apt.appointment_time
        })));

        return {
            nextAppointment: futureAppointments[0] || null,
            remainingAppointments: futureAppointments.slice(1),
        };
    };

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
        const date = new Date(dateString); // ✅ Use the full ISO string directly
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


    // Clear old integer-based cache keys
    useEffect(() => {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith('appointments_') && key.match(/appointments_\d+$/)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
    }, []);

    // Fixed: Main fetch effect using correct variables
    useEffect(() => {
        const fetchAppointments = async () => {
            // Wait for auth context to finish loading
            if (authLoading) {
                console.log("Auth context still loading, waiting...");
                return;
            }

            // If no token after loading is complete, user is not logged in
            if (!token) {
                console.log("No token after auth loading complete");
                setDashboardLoading(false);
                return;
            }

            // If no user data after loading, something is wrong
            if (!user?.id) {
                console.log("No user UID after auth loading complete", { user });
                setDashboardLoading(false);
                return;
            }

            const cacheKey = `appointments_${user.id}`;

            try {
                console.log("Fetching appointments for user:", user.id);

                // secureFetch should handle the response parsing ONCE
                const data = await secureFetch(`${API_URL}/appointments`, token);

                // 🔧 Normalize: backend may return {appointments: []} or just []
                const appointments = data.appointments || data || [];
                console.log("✅ Final parsed appointments:", appointments);
                console.log("✅ Final parsed appointments:", appointments);
                console.log("🔍 First appointment structure:", appointments[0]);
                console.log("🔍 Total appointments count:", appointments.length);


                setUpcomingAppointments(appointments);
                localStorage.setItem(cacheKey, JSON.stringify(appointments));

            } catch (err) {
                console.error("Error fetching appointments:", err.message);
                setUpcomingAppointments([]);
            } finally {
                setInitialized(true);
                setDashboardLoading(false);
            }
        };

        fetchAppointments();
    }, [token, user?.id, authLoading]); // Make sure dependencies are correct

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { nextAppointment, remainingAppointments } = useMemo(() => {
        return getAppointmentData(upcomingAppointments);
    }, [upcomingAppointments]);

    // Fixed: Update refreshAppointments to use correct loading setter
    const refreshAppointments = useCallback(() => {
        setRefreshTrigger(prev => prev + 1);
        setDashboardLoading(true);
    }, []);

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
                        >
                            <History className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </div>
            </div>

            {/* Current Status - Priority Card (Next Appointment) */}
            {nextAppointment ? (
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
                {/* ✅ Clean Debug Info */}
                <div style={{ background: '#f0f9ff', padding: '10px', margin: '10px 0', border: '1px solid #bae6fd', borderRadius: '8px' }}>
                    <p className="text-sm text-slate-600">
                        <strong>Appointments:</strong> {upcomingAppointments ? upcomingAppointments.length : 0} total,
                        <strong> Next:</strong> {nextAppointment ? `ID ${nextAppointment.id} (${formatAppointmentDate(nextAppointment.appointment_date)})` : 'None'},
                        <strong> Remaining:</strong> {remainingAppointments ? remainingAppointments.length : 0}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {dashboardLoading ? (
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
                {/* ✅ TEMPORARY DEBUG - Add this */}
                <div style={{ background: '#f0f9ff', padding: '10px', margin: '10px 0', border: '1px solid #bae6fd', borderRadius: '8px' }}>
                    <h4 className="font-semibold text-slate-700">🔍 Detailed Debug:</h4>
                    <p className="text-sm">Total appointments: {upcomingAppointments ? upcomingAppointments.length : 0}</p>
                    <p className="text-sm">Next appointment ID: {nextAppointment ? nextAppointment.id : 'None'}</p>
                    <p className="text-sm">Remaining appointments: {remainingAppointments ? remainingAppointments.length : 0}</p>
                    {remainingAppointments && remainingAppointments.length > 0 && (
                        <p className="text-sm">Remaining IDs: {remainingAppointments.map(apt => apt.id).join(', ')}</p>
                    )}
                    {upcomingAppointments && (
                        <div className="mt-2">
                            <p className="text-sm font-semibold">All Appointments:</p>
                            {upcomingAppointments.map((apt, index) => (
                                <p key={apt.id} className="text-sm">
                                    #{index + 1}: ID {apt.id} - {apt.doctor} - {apt.appointment_date}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
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