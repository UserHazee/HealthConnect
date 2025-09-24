import React, { useState } from "react";
import { useEffect } from "react";
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
    Camera,
    Shield,
    Key,
    Save,
    Upload,
    Edit3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import Layout from "@/components/ui/layout";

export default function PatientSettings() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profilePic, setProfilePic] = useState(
        "https://images.unsplash.com/photo-1494790108755-2616b612b739?w=100&h=100&fit=crop&crop=face"
    );
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            setProfilePic(fileUrl);
        }
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("New password and confirmation do not match!");
            return;
        }
        console.log("Password updated:", { oldPassword, newPassword });
        // Reset form
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };
      useEffect(() => {
        window.scrollTo(0, 0);
      }, []); // The empty dependency array ensures this runs only once, on mount
    

    return (
        <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30" style={{ fontFamily: `Inter, "Noto Sans", sans-serif` }}>
                {/* Main Content */}
                <div className="flex flex-col flex-1 min-w-0">
                    {/* Main Content */}
                    <main className="flex-1 overflow-auto">
                        <div className="max-w-4xl p-4 mx-auto lg:p-8">
                            {/* Welcome Header */}
                            <div className="mb-8 lg:mb-12">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                    <div>
                                        <h1 className="mb-2 text-2xl font-bold lg:text-4xl text-slate-800">
                                            Patient Settings ⚙️
                                        </h1>
                                        <p className="text-base text-slate-600 lg:text-lg">
                                            Manage your account details and preferences
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {/* Profile Picture Section */}
                                <Card className="shadow-lg bg-white/95 backdrop-blur-xl">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-xl">
                                                <Camera className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-800">Profile Picture</h3>
                                                <p className="text-sm text-slate-600">Update your profile photo</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                                            <div className="relative">
                                                <div className="w-24 h-24 overflow-hidden border-4 border-white rounded-full shadow-lg lg:w-32 lg:h-32">
                                                    <img
                                                        src={profilePic}
                                                        alt="Current profile"
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                                <button className="absolute bottom-0 right-0 flex items-center justify-center w-8 h-8 text-white transition-colors bg-blue-500 border-2 border-white rounded-full shadow-lg hover:bg-blue-600">
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="flex-1 space-y-4">
                                                <div>
                                                    <label
                                                        htmlFor="profile-picture-upload"
                                                        className="cursor-pointer"
                                                    >
                                                        <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600">
                                                            <Upload className="w-4 h-4 mr-2" />
                                                            Upload New Picture
                                                        </div>
                                                    </label>
                                                    <input
                                                        id="profile-picture-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={handleFileChange}
                                                    />
                                                </div>
                                                <div className="p-4 rounded-lg bg-blue-50">
                                                    <p className="text-sm text-blue-700">
                                                        <strong>Guidelines:</strong> Upload a clear photo of yourself.
                                                        Supported formats: PNG, JPG, GIF up to 10MB.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Change Password Section */}
                                <Card className="shadow-lg bg-white/95 backdrop-blur-xl">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="flex items-center justify-center w-12 h-12 bg-purple-500 rounded-xl">
                                                <Key className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-800">Change Password</h3>
                                                <p className="text-sm text-slate-600">Update your account password</p>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <label htmlFor="old-password" className="block mb-2 text-sm font-medium text-gray-700">
                                                    Current Password
                                                </label>
                                                <input
                                                    id="old-password"
                                                    type="password"
                                                    placeholder="Enter your current password"
                                                    value={oldPassword}
                                                    onChange={(e) => setOldPassword(e.target.value)}
                                                    className="w-full px-4 py-3 text-sm transition-colors border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:bg-white"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                                <div>
                                                    <label htmlFor="new-password" className="block mb-2 text-sm font-medium text-gray-700">
                                                        New Password
                                                    </label>
                                                    <input
                                                        id="new-password"
                                                        type="password"
                                                        placeholder="Enter your new password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        className="w-full px-4 py-3 text-sm transition-colors border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:bg-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-700">
                                                        Confirm New Password
                                                    </label>
                                                    <input
                                                        id="confirm-password"
                                                        type="password"
                                                        placeholder="Confirm your new password"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        className="w-full px-4 py-3 text-sm transition-colors border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:bg-white"
                                                    />
                                                </div>
                                            </div>

                                            <div className="p-4 rounded-lg bg-amber-50">
                                                <div className="flex items-start gap-2">
                                                    <Shield className="w-5 h-5 mt-0.5 text-amber-600" />
                                                    <div>
                                                        <h4 className="text-sm font-medium text-amber-800">Password Security Tips</h4>
                                                        <ul className="mt-2 space-y-1 text-sm list-disc list-inside text-amber-700">
                                                            <li>Use at least 8 characters with mixed case letters</li>
                                                            <li>Include numbers and special characters</li>
                                                            <li>Avoid using personal information</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-end">
                                                <Button
                                                    onClick={handlePasswordSubmit}
                                                    className="px-6 py-3 text-white shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                                                >
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Update Password
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Account Information */}
                                <Card className="shadow-lg bg-white/95 backdrop-blur-xl">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-xl">
                                                <User className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-800">Account Information</h3>
                                                <p className="text-sm text-slate-600">Your basic account details</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                            <div className="p-4 border border-gray-200 rounded-lg">
                                                <p className="mb-1 text-sm font-medium text-gray-500">Full Name</p>
                                                <p className="text-gray-800">Sophia Clark</p>
                                            </div>
                                            <div className="p-4 border border-gray-200 rounded-lg">
                                                <p className="mb-1 text-sm font-medium text-gray-500">Patient ID</p>
                                                <p className="text-gray-800">#SC2024</p>
                                            </div>
                                            <div className="p-4 border border-gray-200 rounded-lg">
                                                <p className="mb-1 text-sm font-medium text-gray-500">Email Address</p>
                                                <p className="text-gray-800">sophia.clark@email.com</p>
                                            </div>
                                            <div className="p-4 border border-gray-200 rounded-lg">
                                                <p className="mb-1 text-sm font-medium text-gray-500">Phone Number</p>
                                                <p className="text-gray-800">(555) 123-4567</p>
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <Button variant="outline" className="w-full lg:w-auto">
                                                <Edit3 className="w-4 h-4 mr-2" />
                                                Edit Account Information
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </Layout>
    );
}