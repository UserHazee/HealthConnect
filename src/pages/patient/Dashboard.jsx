// src/pages/dashboard/Dashboard.jsx
import React, { useEffect, useState } from "react";
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
import { useAuth } from "@/auth/AuthContext";  // ✅ import auth context

const API_URL = import.meta.env.VITE_API_URL || "/api";

export default function Dashboard() {
    const { token } = useAuth(); // ✅ get token from context
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ Fetch appointments from backend
    useEffect(() => {
        const fetchAppointments = async () => {
            if (!token) {
                console.warn("⚠️ No token, skipping appointments fetch");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${API_URL}/appointments`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    throw new Error(`Failed to fetch appointments: ${res.status}`);
                }

                const data = await res.json();
                setUpcomingAppointments(data);
            } catch (err) {
                console.error("Error fetching appointments:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [token]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Layout>
            {/* ✅ UI remains unchanged, just mapping data */}
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
                        <Button size="sm" variant="outline" className="text-sm">
                            <History className="w-4 h-4 mr-2" />
                            History
                        </Button>
                    </div>
                </div>
            </div>

            {/* Current Status - Priority Card */}
            <Card className="mb-8 border-green-200 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
                <CardContent className="p-6">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                        <div className="flex items-center flex-1 gap-4">
                            <div className="flex items-center justify-center shadow-lg w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl">
                                <Clock className="text-white w-7 h-7" />
                            </div>
                            <div className="flex-1">
                                <h3 className="mb-1 text-lg font-semibold text-slate-800">
                                    Next: General Checkup
                                </h3>
                                <p className="mb-2 text-sm text-slate-600">
                                    Dr. Emily Carter • Today at 10:00 AM
                                </p>
                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>Room 204</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Phone className="w-4 h-4" />
                                        <span>(555) 123-4567</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:text-right">
                            <Badge className="mb-3 text-green-700 bg-green-100 border-green-200">
                                ~15 min wait
                            </Badge>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Queue Position</span>
                                    <span className="font-medium text-slate-800">#3 of 8</span>
                                </div>
                                <Progress value={45} className="h-2" />
                                <p className="text-xs text-slate-500">2 people ahead of you</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <section className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold lg:text-2xl text-slate-800">
                        Upcoming Appointments
                    </h2>
                    <Button variant="outline" size="sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        View All
                    </Button>
                </div>

                {loading ? (
                    <p>Loading appointments...</p>
                ) : upcomingAppointments.length === 0 ? (
                    <p className="text-slate-600">No upcoming appointments</p>
                ) : (
                    <div className="grid gap-4 lg:gap-6">
                        {upcomingAppointments.map((appointment) => (
                            <Card
                                key={appointment.id}
                                className="transition-all duration-300 cursor-pointer group hover:shadow-lg hover:-translate-y-1"
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4">
                                        {/* Icon */}
                                        <div className="flex items-center justify-center w-12 h-12 text-white bg-blue-500 rounded-xl">
                                            <User className="w-6 h-6" />
                                        </div>

                                        {/* Appointment Info */}
                                        <div className="flex-1 min-w-0">
                                            {/* Department on top */}
                                            <h3 className="mb-1 text-sm font-medium text-blue-600">
                                                {appointment.department}
                                            </h3>
                                            {/* Doctor */}
                                            <p className="mb-1 text-lg font-semibold text-slate-800">
                                                {appointment.doctor}
                                            </p>
                                            {/* Date + Time */}
                                            <p className="text-sm text-slate-600">
                                                {new Date(appointment.appointment_date).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}{" "}
                                                - {appointment.appointment_time}
                                            </p>
                                        </div>

                                        {/* Right arrow */}
                                        <ChevronRight className="w-5 h-5 text-slate-400" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                    </div>
                )}
            </section>

            {/* Health Summary stays untouched */}
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
