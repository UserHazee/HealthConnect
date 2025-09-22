import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    Calendar,
    Clock,
    User,
    Settings,
    FolderOpen,
    Plus,
    History,
    Menu,
    X,
    ChevronRight,
    Bell,
    MapPin,
    Phone,
    FileText,
    Download,
    Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import Layout from "../../components/ui/layout";

export default function AppointmentHistory() {

    const appointmentHistory = [
        {
            id: 1,
            date: "July 15, 2024",
            time: "10:30 AM",
            doctor: "Dr. Emily Carter",
            department: "Cardiology",
            type: "General Checkup",
            status: "Completed",
            location: "Room 204",
            color: "bg-blue-500",
            statusColor: "bg-green-100 text-green-700 border-green-200"
        },
        {
            id: 2,
            date: "May 20, 2024",
            time: "02:00 PM",
            doctor: "Dr. John Smith",
            department: "Dermatology",
            type: "Skin Consultation",
            status: "Completed",
            location: "Room 315",
            color: "bg-purple-500",
            statusColor: "bg-green-100 text-green-700 border-green-200"
        },
        {
            id: 3,
            date: "February 10, 2024",
            time: "09:00 AM",
            doctor: "Dr. Sarah Lee",
            department: "Orthopedics",
            type: "Follow-up",
            status: "Completed",
            location: "Room 108",
            color: "bg-orange-500",
            statusColor: "bg-green-100 text-green-700 border-green-200"
        },
        {
            id: 4,
            date: "January 5, 2024",
            time: "11:00 AM",
            doctor: "Dr. Michael Brown",
            department: "General Medicine",
            type: "Annual Physical",
            status: "Completed",
            location: "Room 201",
            color: "bg-green-500",
            statusColor: "bg-green-100 text-green-700 border-green-200"
        }
    ];

    return (
       <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30" style={{ fontFamily: `Inter, "Noto Sans", sans-serif` }}>
                {/* Main Content */}
                <div className="flex flex-col flex-1 min-w-0">
                    {/* Main Content */}
                    <main className="flex-1 overflow-auto">
                        <div className="max-w-6xl p-4 mx-auto lg:p-8">
                            {/* Welcome Header */}
                            <div className="mb-8 lg:mb-12">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                    <div>
                                        <h1 className="mb-2 text-2xl font-bold lg:text-4xl text-slate-800">
                                            Appointment History 📋
                                        </h1>
                                        <p className="text-base text-slate-600 lg:text-lg">
                                            A chronological record of your past hospital appointments
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button size="sm" variant="outline" className="text-sm">
                                            <Download className="w-4 h-4 mr-2" />
                                            Export
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
                                <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="mb-1 text-sm font-medium text-blue-600">Total Appointments</p>
                                                <p className="text-2xl font-bold text-slate-800">24</p>
                                                <p className="text-sm text-slate-500">This year</p>
                                            </div>
                                            <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-xl">
                                                <Calendar className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="mb-1 text-sm font-medium text-green-600">Completed</p>
                                                <p className="text-2xl font-bold text-slate-800">22</p>
                                                <p className="text-sm text-slate-500">Successful visits</p>
                                            </div>
                                            <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-xl">
                                                <FileText className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="mb-1 text-sm font-medium text-purple-600">Last Visit</p>
                                                <p className="text-2xl font-bold text-slate-800">15</p>
                                                <p className="text-sm text-slate-500">Days ago</p>
                                            </div>
                                            <div className="flex items-center justify-center w-12 h-12 bg-purple-500 rounded-xl">
                                                <Clock className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Appointment History List */}
                            <section>
                                <h2 className="mb-6 text-xl font-bold lg:text-2xl text-slate-800">
                                    Recent Appointments
                                </h2>

                                <div className="space-y-4">
                                    {appointmentHistory.map((appointment) => (
                                        <Card key={appointment.id} className="transition-all duration-300 cursor-pointer group hover:shadow-lg hover:-translate-y-1 bg-white/95 backdrop-blur-xl">
                                            <CardContent className="p-6">
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-12 h-12 ${appointment.color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                                        <Calendar className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-3 mb-2">
                                                                    <h3 className="text-lg font-semibold text-slate-800">
                                                                        {appointment.date} - {appointment.time}
                                                                    </h3>
                                                                    <Badge className={`text-xs ${appointment.statusColor}`}>
                                                                        {appointment.status}
                                                                    </Badge>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <p className="font-medium text-slate-800">
                                                                        {appointment.doctor}
                                                                    </p>
                                                                    <div className="flex flex-col gap-1 text-sm text-slate-600 lg:flex-row lg:gap-4">
                                                                        <div className="flex items-center gap-1">
                                                                            <User className="w-4 h-4" />
                                                                            <span>{appointment.department}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-1">
                                                                            <FileText className="w-4 h-4" />
                                                                            <span>{appointment.type}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-1">
                                                                            <MapPin className="w-4 h-4" />
                                                                            <span>{appointment.location}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Button variant="outline" size="sm">
                                                                    <FileText className="w-4 h-4 mr-1" />
                                                                    View Details
                                                                </Button>
                                                                <ChevronRight className="w-5 h-5 transition-colors text-slate-400 group-hover:text-slate-600" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </section>

                            {/* Footer Note */}
                            <Card className="mt-8 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-3">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500">
                                            <Bell className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 font-medium text-amber-800">Important Note</h3>
                                            <p className="text-sm text-amber-700">
                                                This history is for informational purposes only. For official records,
                                                please contact the hospital administration.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </main>
                </div>
            </div>
            </Layout>
    );
}