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
    Search,
    ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "../../components/ui/layout";

export default function AppointmentBooking() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState("10:00 AM");
    const [currentMonth, setCurrentMonth] = useState("July 2024");

    const departments = ["Cardiology", "Neurology", "Oncology", "Dermatology"];
    const doctors = ["Dr. Emily Carter", "Dr. John Doe", "Dr. Robert Harris"];

    const availableSlots = [
        { time: "9:00 AM", available: true },
        { time: "10:00 AM", available: true },
        { time: "11:00 AM", available: false },
        { time: "2:00 PM", available: true },
        { time: "3:00 PM", available: true },
        { time: "4:00 PM", available: false },
    ];

    const generateCalendarDays = (month) => {
        const days = month === "July 2024" ? 31 : 31;
        const disabledDays = month === "August 2024" ? [1, 2, 3] : [];

        return Array.from({ length: days }, (_, i) => ({
            day: i + 1,
            disabled: disabledDays.includes(i + 1),
            selected: selectedDate === `${month.split(' ')[0]} ${i + 1}, ${month.split(' ')[1]}`
        }));
    };

    const handleDateSelect = (day, month) => {
        if (!day.disabled) {
            setSelectedDate(`${month.split(' ')[0]} ${day.day}, ${month.split(' ')[1]}`);
        }
    };

    return (<Layout>
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
                                        Book Your Appointment 📅
                                    </h1>
                                    <p className="text-base text-slate-600 lg:text-lg">
                                        Find and schedule your next medical appointment
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

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            {/* Filters Sidebar */}
                            <div className="lg:col-span-1">
                                <Card className="shadow-lg bg-white/95 backdrop-blur-xl">
                                    <CardContent className="p-6">
                                        <h3 className="mb-6 text-lg font-semibold text-slate-800">Search Filters</h3>

                                        {/* Search Input */}
                                        <div className="relative mb-6">
                                            <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                                            <input
                                                type="text"
                                                placeholder="Search department, doctor..."
                                                className="w-full py-3 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 border border-gray-200 rounded-lg bg-gray-50 focus:border-blue-500 focus:ring-blue-500 focus:bg-white"
                                            />
                                        </div>

                                        {/* Department Select */}
                                        <div className="mb-6 space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Department</label>
                                            <select
                                                value={selectedDepartment}
                                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                                className="w-full p-3 text-sm text-gray-800 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                                            >
                                                <option value="">Select a department</option>
                                                {departments.map((dept) => (
                                                    <option key={dept}>{dept}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Doctor Select */}
                                        <div className="mb-6 space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Doctor (Optional)</label>
                                            <select
                                                value={selectedDoctor}
                                                onChange={(e) => setSelectedDoctor(e.target.value)}
                                                className="w-full p-3 text-sm text-gray-800 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                                            >
                                                <option value="">Select a doctor</option>
                                                {doctors.map((doc) => (
                                                    <option key={doc}>{doc}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <Button className="w-full text-white shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                                            <Search className="w-4 h-4 mr-2" />
                                            Search Available Slots
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Calendar and Booking */}
                            <div className="lg:col-span-2">
                                <div className="space-y-6">
                                    {/* Calendar Cards */}
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        {/* July Calendar */}
                                        <Card className="shadow-lg bg-white/95 backdrop-blur-xl">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between pb-4">
                                                    <Button variant="ghost" size="icon" className="text-gray-500">
                                                        <ChevronLeft className="w-5 h-5" />
                                                    </Button>
                                                    <p className="text-base font-semibold text-gray-800">July 2024</p>
                                                    <Button variant="ghost" size="icon" className="text-gray-500">
                                                        <ChevronRight className="w-5 h-5" />
                                                    </Button>
                                                </div>

                                                {/* Weekday Labels */}
                                                <div className="grid grid-cols-7 gap-2 mb-4 text-sm text-center">
                                                    {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                                                        <div key={day} className="font-medium text-gray-500">
                                                            {day}
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Calendar Days */}
                                                <div className="grid grid-cols-7 gap-2">
                                                    {generateCalendarDays("July 2024").map((dayObj) => (
                                                        <button
                                                            key={dayObj.day}
                                                            disabled={dayObj.disabled}
                                                            onClick={() => handleDateSelect(dayObj, "July 2024")}
                                                            className={`h-10 w-10 rounded-full transition-all duration-200 text-sm font-medium ${dayObj.disabled
                                                                ? "text-gray-400 cursor-not-allowed"
                                                                : dayObj.selected
                                                                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                                                                    : "hover:bg-gray-100 text-gray-800"
                                                                }`}
                                                        >
                                                            {dayObj.day}
                                                        </button>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* August Calendar */}
                                        <Card className="shadow-lg bg-white/95 backdrop-blur-xl">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between pb-4">
                                                    <Button variant="ghost" size="icon" className="text-gray-500">
                                                        <ChevronLeft className="w-5 h-5" />
                                                    </Button>
                                                    <p className="text-base font-semibold text-gray-800">August 2024</p>
                                                    <Button variant="ghost" size="icon" className="text-gray-500">
                                                        <ChevronRight className="w-5 h-5" />
                                                    </Button>
                                                </div>

                                                {/* Weekday Labels */}
                                                <div className="grid grid-cols-7 gap-2 mb-4 text-sm text-center">
                                                    {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                                                        <div key={day} className="font-medium text-gray-500">
                                                            {day}
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Calendar Days */}
                                                <div className="grid grid-cols-7 gap-2">
                                                    {generateCalendarDays("August 2024").map((dayObj) => (
                                                        <button
                                                            key={dayObj.day}
                                                            disabled={dayObj.disabled}
                                                            onClick={() => handleDateSelect(dayObj, "August 2024")}
                                                            className={`h-10 w-10 rounded-full transition-all duration-200 text-sm font-medium ${dayObj.disabled
                                                                ? "text-gray-400 cursor-not-allowed"
                                                                : dayObj.selected
                                                                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                                                                    : "hover:bg-gray-100 text-gray-800"
                                                                }`}
                                                        >
                                                            {dayObj.day}
                                                        </button>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Available Time Slots */}
                                    {selectedDate && (
                                        <Card className="shadow-lg bg-white/95 backdrop-blur-xl">
                                            <CardContent className="p-6">
                                                <h3 className="mb-4 text-lg font-semibold text-slate-800">
                                                    Available Time Slots for {selectedDate}
                                                </h3>
                                                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                                                    {availableSlots.map((slot) => (
                                                        <button
                                                            key={slot.time}
                                                            disabled={!slot.available}
                                                            onClick={() => setSelectedTime(slot.time)}
                                                            className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${!slot.available
                                                                ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                                                                : selectedTime === slot.time
                                                                    ? "border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600"
                                                                    : "border-gray-200 text-gray-800 hover:border-blue-300 hover:bg-blue-50"
                                                                }`}
                                                        >
                                                            {slot.time}
                                                            {!slot.available && (
                                                                <div className="text-xs text-gray-400">Unavailable</div>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Appointment Summary */}
                                    <Card className="border-green-200 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
                                        <CardContent className="p-6">
                                            <h3 className="mb-4 text-lg font-semibold text-slate-800">
                                                Appointment Summary
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="flex justify-between">
                                                    <span className="text-sm font-medium text-gray-500">Department</span>
                                                    <span className="text-sm text-gray-800">{selectedDepartment || "Cardiology"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm font-medium text-gray-500">Doctor</span>
                                                    <span className="text-sm text-gray-800">{selectedDoctor || "Dr. Emily Carter"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm font-medium text-gray-500">Date</span>
                                                    <span className="text-sm text-gray-800">{selectedDate || "Select a date"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm font-medium text-gray-500">Time</span>
                                                    <span className="text-sm text-gray-800">{selectedTime}</span>
                                                </div>
                                            </div>

                                            <div className="flex justify-end mt-6">
                                                <Button
                                                    className="px-8 py-3 text-white shadow-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                                                    disabled={!selectedDate}
                                                >
                                                    <Calendar className="w-4 h-4 mr-2" />
                                                    Confirm Appointment
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    </Layout>
    );
}