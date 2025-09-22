import React from "react";
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

export default function Dashboard() {
    const upcomingAppointments = [
        {
            id: 1,
            type: "General Checkup",
            doctor: "Dr. Emily Carter",
            date: "July 15, 2024",
            time: "10:00 AM",
            location: "Room 204",
            color: "bg-blue-500",
            icon: User,
        },
        {
            id: 2,
            type: "Dermatology Consultation",
            doctor: "Dr. Robert Harris",
            date: "August 22, 2024",
            time: "2:30 PM",
            location: "Room 315",
            color: "bg-purple-500",
            icon: Calendar,
        },
    ];

    return (
        <Layout>
            {/* Welcome Header */}
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

                <div className="grid gap-4 lg:gap-6">
                    {upcomingAppointments.map((appointment) => (
                        <Card
                            key={appointment.id}
                            className="transition-all duration-300 cursor-pointer group hover:shadow-lg hover:-translate-y-1"
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`w-12 h-12 ${appointment.color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <appointment.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="mb-1 text-lg font-semibold text-slate-800">
                                            {appointment.type}
                                        </h3>
                                        <p className="mb-2 text-sm text-slate-600">
                                            {appointment.doctor}
                                        </p>
                                        <div className="flex items-center gap-1 text-sm text-slate-500">
                                            <MapPin className="w-4 h-4" />
                                            <span>{appointment.location}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="mb-1 font-semibold text-slate-800">
                                            {appointment.date}
                                        </p>
                                        <p className="text-sm text-slate-600">{appointment.time}</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 transition-colors text-slate-400 group-hover:text-slate-600" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
            {/* Quick Stats Grid */}
            <section>
                <h2 className="text-xl lg:text-2xl font-bold text-slate-800 mb-6">
                    Health Summary
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-600 text-sm font-medium mb-1">Total Visits</p>
                                    <p className="text-2xl font-bold text-slate-800">24</p>
                                    <p className="text-slate-500 text-sm">This year</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-600 text-sm font-medium mb-1">Next Checkup</p>
                                    <p className="text-2xl font-bold text-slate-800">15</p>
                                    <p className="text-slate-500 text-sm">Days away</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-600 text-sm font-medium mb-1">Health Score</p>
                                    <p className="text-2xl font-bold text-slate-800">92%</p>
                                    <p className="text-slate-500 text-sm">Excellent</p>
                                </div>
                                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
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
