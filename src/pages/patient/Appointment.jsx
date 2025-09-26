import React, { useState, useEffect } from "react";
import { Calendar, History, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "../../components/ui/layout";
import { useAuth } from "../../auth/AuthContext"; // ✅ Import Auth

export default function AppointmentBooking() {
    const { token } = useAuth(); // ✅ Get logged-in user’s token

    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [selectedDate, setSelectedDate] = useState(null); // backend YYYY-MM-DD
    const [selectedDateLabel, setSelectedDateLabel] = useState(""); // UI format
    const [selectedTime, setSelectedTime] = useState("10:00 AM");
    const [appointments, setAppointments] = useState([]); // ✅ store history

    // 🔹 Calendar state (default = today's month/year)
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const [month, setMonth] = useState(startOfToday.getMonth());
    const [year, setYear] = useState(startOfToday.getFullYear());

    const departments = ["Cardiology", "Neurology", "Oncology", "Dermatology"];
    const doctors = ["Dr. Emily Carter", "Dr. John Doe", "Dr. Robert Harris"];

    const availableSlots = [
        { time: "8:00 AM", available: true },
        { time: "9:00 AM", available: true },
        { time: "10:00 AM", available: true },
        { time: "11:00 AM", available: true },
        { time: "12:00 NN", available: true, note: "Staff on catch-up meal" },
        { time: "1:00 PM", available: true },
        { time: "2:00 PM", available: true },
        { time: "3:00 PM", available: true },
        { time: "4:00 PM", available: true },
        { time: "5:00 PM", available: true },
    ];

    // ✅ Generate days for current month
    const generateCalendarDays = (monthIndex, yearVal) => {
        const daysInMonth = new Date(yearVal, monthIndex + 1, 0).getDate();
        return Array.from({ length: daysInMonth }, (_, i) => {
            const current = new Date(yearVal, monthIndex, i + 1);
            return {
                day: i + 1,
                // disabled if earlier than today
                disabled: current < startOfToday,
            };
        });
    };

    // ✅ Handle selecting a date
    const handleDateSelect = (day) => {
        if (!day.disabled) {
            const formatted = `${year}-${String(month + 1).padStart(2, "0")}-${String(
                day.day
            ).padStart(2, "0")}`;
            setSelectedDate(formatted);

            // friendly label
            const friendly = new Date(year, month, day.day).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
            });
            setSelectedDateLabel(friendly);
        }
    };

    // ✅ Navigate months
    const handlePrevMonth = () => {
        if (month === 0) {
            setMonth(11);
            setYear((y) => y - 1);
        } else {
            setMonth((m) => m - 1);
        }
    };

    const handleNextMonth = () => {
        if (month === 11) {
            setMonth(0);
            setYear((y) => y + 1);
        } else {
            setMonth((m) => m + 1);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // -----------------------
    // Fetch appointments (used by History button and on mount)
    // tries backend when token exists, falls back to localStorage
    // -----------------------
    const fetchAppointments = async () => {
        // try backend if token present
        if (token) {
            try {
                const res = await fetch("/api/appointments", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setAppointments(data);
                    // keep local copy as fallback
                    localStorage.setItem("appointments", JSON.stringify(data));
                    return;
                }
                // if not ok, fall through to localStorage fallback
                console.warn("Fetch appointments backend returned not ok, falling back to localStorage");
            } catch (err) {
                console.warn("Fetch appointments backend failed, falling back to localStorage", err);
            }
        }

        // fallback to localStorage
        const stored = localStorage.getItem("appointments");
        if (stored) {
            try {
                setAppointments(JSON.parse(stored));
            } catch (err) {
                console.error("Failed parsing appointments from localStorage", err);
                setAppointments([]);
            }
        } else {
            setAppointments([]);
        }
    };

    // -----------------------
    // Book appointment
    // -----------------------
    const handleConfirmAppointment = async () => {
        if (!selectedDepartment || !selectedDoctor || !selectedDate || !selectedTime) {
            alert("Please complete all fields before confirming.");
            return;
        }

        // build appointment
        const newAppointment = {
            id: Date.now(),
            department: selectedDepartment,
            doctor: selectedDoctor,
            appointment_date: selectedDate, // ✅ already correct local YYYY-MM-DD
            appointment_time: selectedTime,
        };
        // try to send to backend if token exists, but still persist locally
        if (token) {
            try {
                const res = await fetch("/api/appointments", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        department: newAppointment.department,
                        doctor: newAppointment.doctor,
                        appointment_date: newAppointment.appointment_date,
                        appointment_time: newAppointment.appointment_time,
                    }),
                });
                const body = await res.json();
                if (!res.ok) {
                    // show server message but still save locally so UI reflects it quickly
                    console.warn("Server booking returned error:", body);
                } else {
                    // Optionally: server could return created id — if it did, replace id
                    if (body.id) newAppointment.id = body.id;
                }
            } catch (err) {
                console.warn("Booking to server failed, saving locally", err);
            }
        }

        // update local state + localStorage so UI shows immediately
        setAppointments((prev) => {
            const updated = [...prev, newAppointment];
            localStorage.setItem("appointments", JSON.stringify(updated));
            return updated;
        });

        alert("✅ Appointment booked successfully!");
    };

    // -----------------------
    // Cancel appointment
    // -----------------------
    const cancelAppointment = async (id) => {
        // try backend delete if token present
        if (token) {
            try {
                const res = await fetch(`/api/appointments/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) {
                    const body = await res.json().catch(() => ({}));
                    console.warn("Cancel returned not ok:", body);
                    // continue to update local state anyway (optimistic)
                }
            } catch (err) {
                console.warn("Backend cancel failed; updating local only", err);
            }
        }

        // update local state and localStorage
        const updated = appointments.filter((a) => a.id !== id);
        setAppointments(updated);
        localStorage.setItem("appointments", JSON.stringify(updated));
        alert("❌ Appointment cancelled");
    };

    // on mount: default selected date = today, and load appointments
    time:

    useEffect(() => {
        const today = new Date();
        const formatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
            2,
            "0"
        )}-${String(today.getDate()).padStart(2, "0")}`; // ✅ local YYYY-MM-DD

        const friendly = today.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });

        setSelectedDate(formatted);
        setSelectedDateLabel(friendly);

        fetchAppointments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // -----------------------
    // Render (UI unchanged)
    // -----------------------
    return (
        <Layout>
            <div
                className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30"
                style={{ fontFamily: `Inter, "Noto Sans", sans-serif` }}
            >
                <div className="flex flex-col flex-1 min-w-0">
                    <main className="flex-1 overflow-auto">
                        <div className="max-w-6xl p-4 mx-auto lg:p-8">
                            {/* Header */}
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
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                                {/* Sidebar */}
                                <div className="lg:col-span-1">
                                    <Card className="shadow-lg bg-white/95 backdrop-blur-xl">
                                        <CardContent className="p-6">
                                            <h3 className="mb-6 text-lg font-semibold text-slate-800">
                                                Search Filters
                                            </h3>
                                            {/* Department */}
                                            <div className="mb-6 space-y-2">
                                                <label className="text-sm font-medium text-gray-700">
                                                    Department
                                                </label>
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

                                            {/* Doctor */}
                                            <div className="mb-6 space-y-2">
                                                <label className="text-sm font-medium text-gray-700">
                                                    Doctor
                                                </label>
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
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Main Booking */}
                                <div className="lg:col-span-2">
                                    <div className="space-y-6">
                                        {/* Calendar */}
                                        <Card className="shadow-lg bg-white/95 backdrop-blur-xl">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between pb-4">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-gray-500"
                                                        onClick={handlePrevMonth}
                                                    >
                                                        <ChevronLeft className="w-5 h-5" />
                                                    </Button>
                                                    <p className="text-base font-semibold text-gray-800">
                                                        {new Date(year, month).toLocaleDateString("en-US", {
                                                            month: "long",
                                                            year: "numeric",
                                                        })}
                                                    </p>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-gray-500"
                                                        onClick={handleNextMonth}
                                                    >
                                                        <ChevronRight className="w-5 h-5" />
                                                    </Button>
                                                </div>

                                                {/* Days */}
                                                <div className="grid grid-cols-7 gap-2">
                                                    {generateCalendarDays(month, year).map((dayObj) => {
                                                        const formatted = `${year}-${String(month + 1).padStart(
                                                            2,
                                                            "0"
                                                        )}-${String(dayObj.day).padStart(2, "0")}`;
                                                        const friendlyLabel = new Date(formatted).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                month: "long",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            }
                                                        );

                                                        // highlight if selected or if no selection, highlight today's date
                                                        const todayLocal = new Date();
                                                        const isToday =
                                                            todayLocal.getDate() === dayObj.day &&
                                                            todayLocal.getMonth() === month &&
                                                            todayLocal.getFullYear() === year;
                                                        const isSelected =
                                                            selectedDateLabel === friendlyLabel || (!selectedDateLabel && isToday);

                                                        return (
                                                            <button
                                                                key={dayObj.day}
                                                                disabled={dayObj.disabled}
                                                                onClick={() => handleDateSelect(dayObj)}
                                                                className={`h-10 w-10 rounded-full transition-all duration-200 text-sm font-medium ${dayObj.disabled
                                                                    ? "text-gray-400 cursor-not-allowed"
                                                                    : isSelected
                                                                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                                                                        : "hover:bg-gray-100 text-gray-800"
                                                                    }`}
                                                            >
                                                                {dayObj.day}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Time slots */}
                                        {selectedDate && (
                                            <Card className="shadow-lg bg-white/95 backdrop-blur-xl">
                                                <CardContent className="p-6">
                                                    <h3 className="mb-4 text-lg font-semibold text-slate-800">
                                                        Available Time Slots for {selectedDateLabel}
                                                    </h3>
                                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                                        {availableSlots.map((slot) => (
                                                            <div
                                                                key={slot.time}
                                                                className="flex flex-col items-center space-y-1 text-center"
                                                            >
                                                                <button
                                                                    disabled={!slot.available}
                                                                    onClick={() => setSelectedTime(slot.time)}
                                                                    className={`w-full py-2 rounded-lg border text-sm font-medium transition-all duration-200 shadow-sm ${!slot.available
                                                                        ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                                                                        : selectedTime === slot.time
                                                                            ? "border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600"
                                                                            : "border-gray-200 text-gray-800 hover:border-blue-300 hover:bg-blue-50"
                                                                        }`}
                                                                >
                                                                    {slot.time}
                                                                </button>
                                                                {slot.note && (
                                                                    <p className="text-[11px] text-amber-600 italic">{slot.note}</p>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}

                                        {/* Summary */}
                                        <Card className="border-green-200 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
                                            <CardContent className="p-6">
                                                <h3 className="mb-4 text-lg font-semibold text-slate-800">
                                                    Appointment Summary
                                                </h3>
                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <span className="text-sm font-medium text-gray-500">
                                                            Department
                                                        </span>
                                                        <span className="text-sm text-gray-800">
                                                            {selectedDepartment || "Cardiology"}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm font-medium text-gray-500">
                                                            Doctor
                                                        </span>
                                                        <span className="text-sm text-gray-800">
                                                            {selectedDoctor || "Dr. Emily Carter"}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm font-medium text-gray-500">Date</span>
                                                        <span className="text-sm text-gray-800">
                                                            {selectedDateLabel || "Select a date"}
                                                        </span>
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
                                                        onClick={handleConfirmAppointment}
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
