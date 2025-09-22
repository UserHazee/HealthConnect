import React from "react";
import { NavbarSignup } from "../components/navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { LeastButton, PrimaryButton } from "../components/button/Button";
import { Link } from "react-router-dom";



export default function RegistrationSuccess({ userName = "User" }) {
  return (
    <section className="flex min-h-[calc(100vh-68px)] items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center">
          <span className="text-6xl text-green-500 material-symbols-outlined">
            check_circle
          </span>
        </div>

        {/* Message */}
        <div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Registration Successful!
          </h2>
          <p className="mt-4 text-lg text-gray-600">Welcome, {userName}!</p>
          <p className="mt-2 text-gray-500 text-md">
            We're so glad to have you join <strong>HealthConnect</strong>. You're now
            ready to book appointments and manage your health journey with us.
          </p>
        </div>

        {/* CTA Button */}
        <div className="mt-8">
          <a
            href="#"
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-[var(--primary-color)] py-3 px-4 text-lg font-medium text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2"
          >
            <span className="mr-2 material-symbols-outlined">
              event_available
            </span>
            Book Your First Appointment
          </a>
        </div>

        {/* Dashboard Link */}
        <div className="mt-4">
          <a
            href="#"
            className="font-medium text-[var(--primary-color)] hover:text-blue-500"
          >
            Go to your Dashboard
          </a>
        </div>
      </div>
    </section>
  );
}
