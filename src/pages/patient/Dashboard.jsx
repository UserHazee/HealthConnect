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

const API_URL = import.meta.env.VITE_API_URL || "/api";

// SECURITY MEASURES
// Add input sanitization
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    return input.replace(/[<>]/g, ''); // Basic XSS protection
};

// Secure API calls
const secureFetch = async (url, token, options = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
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
    const { token, user } = useAuth();

    // 🚀 Create user-specific cache key
    const getCacheKey = () => {
        if (!user?.id) return null;
        return `appointments_${user.id}`;
    };

    // 🚀 KEY FIX: Initialize state from user-specific localStorage
    const [upcomingAppointments, setUpcomingAppointments] = useState(() => {
        const cacheKey = getCacheKey();
        if (!cacheKey) return null;

        const cached = localStorage.getItem(cacheKey);
        try {
            return cached ? JSON.parse(cached) : null;
        } catch {
            console.warn("Failed to parse cached appointments");
            return null;
        }
    });

    const [initialized, setInitialized] = useState(() => {
        const cacheKey = getCacheKey();
        return cacheKey ? !!localStorage.getItem(cacheKey) : false;
    });

    const [loading, setLoading] = useState(() => {
        const cacheKey = getCacheKey();
        return cacheKey ? !localStorage.getItem(cacheKey) : true;
    });

    // Add refresh trigger
    const [refreshTrigger, setRefreshTrigger] = useState(0);


    // 🎯 Logic to get next appointment and remaining appointments
    const getAppointmentData = (appointments) => {
        // ... (implementation of getAppointmentData remains the same, but takes appointments as an argument)
        if (!appointments || !Array.isArray(appointments)) {
            console.log("No appointments array:", appointments);
            return { nextAppointment: null, remainingAppointments: [] };
        }
        // ... (rest of filtering, sorting, and return logic for appointments)
        const now = new Date();
        const futureAppointments = appointments.filter(appointment => {
            const appointmentDate = appointment.appointment_date.split('T')[0];
            const appointmentDateTime = new Date(`${appointmentDate}T${convertTo24Hour(appointment.appointment_time)}`);
            return appointmentDateTime > now;
        });

        const sortedAppointments = futureAppointments.sort((a, b) => {
            const appointmentDateA = a.appointment_date.split('T')[0];
            const appointmentDateB = b.appointment_date.split('T')[0];
            const dateA = new Date(`${appointmentDateA}T${convertTo24Hour(a.appointment_time)}`);
            const dateB = new Date(`${appointmentDateB}T${convertTo24Hour(b.appointment_time)}`);
            return dateA - dateB;
        });

        return {
            nextAppointment: sortedAppointments[0] || null,
            remainingAppointments: sortedAppointments.slice(1)
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
            hours = String(parseInt(hours, 10) + 12); // Convert to string
        }

        return `${hours.padStart(2, '0')}:${minutes}`;
    };

    // Helper function to format appointment date
    const formatAppointmentDate = (dateString) => {
        // Handle ISO timestamp format from database
        const appointmentDate = dateString.split('T')[0]; // Extract '2025-09-24' from '2025-09-24T16:00:00.000Z'
        const date = new Date(appointmentDate + 'T00:00:00'); // Add time to avoid timezone issues
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Compare just the date parts
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
                day: "numeric"
            });
        }
    };


    useEffect(() => {
        const fetchAppointments = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            const cacheKey = getCacheKey();
            if (!cacheKey) {
                setLoading(false);
                return;
            }

            try {
                // 💡 FIX: Replace standard fetch with the secureFetch function
                const data = await secureFetch(`${API_URL}/appointments`, token); // Pass URL and token

                // If the call succeeds (secureFetch throws on non-2xx status),
                // 'data' will be the parsed JSON object.
                setUpcomingAppointments(data || []);
                localStorage.setItem(cacheKey, JSON.stringify(data || []));

            } catch (err) {
                console.error("Error fetching appointments:", err.message); // Logs the structured error message

                // Clear cache only on specific errors like 401/404 if needed, 
                // but for simplicity, we treat any secureFetch error as a failure
                // and clear the cache to ensure fresh data on next load.
                localStorage.removeItem(cacheKey);
                setUpcomingAppointments([]);

            } finally {
                setInitialized(true);
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [token, user?.id, refreshTrigger]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { nextAppointment, remainingAppointments } = useMemo(() => {
        return getAppointmentData(upcomingAppointments);
    }, [upcomingAppointments]); // Only recalculate when appointments change

    // Memoize functions that are passed as props
    const refreshAppointments = useCallback(() => {
        setRefreshTrigger(prev => prev + 1);
        setLoading(true);
    }, []);

    return (
        <Layout>
            {/* UI remains unchanged */}
            <div className="mb-8 lg:mb-12">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="mb-2 text-2xl font-bold lg:text-4xl text-slate-800">
                            Good morning, Sophia! 🌅
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

                <AnimatePresence mode="wait">
                    {loading ? (
                        <div className="grid gap-4 lg:gap-6">
                            <AppointmentSkeleton key="skeleton1" />
                            <AppointmentSkeleton key="skeleton2" />
                            <AppointmentSkeleton key="skeleton3" />
                        </div>
                    ) : remainingAppointments.length === 0 ? (
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