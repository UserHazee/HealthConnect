// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signin from "./auth/Login.jsx";
import Register from "./auth/Signup.jsx";
import Dashboard from "./pages/patient/Dashboard.jsx";
import AppointmentBooking from "./pages/patient/Appointment.jsx";
import AppointmentHistory from "./pages/patient/AppointmentHistory.jsx";
import PatientSettings from "./pages/patient/PatientSetting.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import PrivateRoute from "./auth/ProtectedRoute.jsx";
import Index from "./Index.jsx";
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Signin />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
           <Route
            path="/appointments"
            element={
              <PrivateRoute>
                <AppointmentBooking />
              </PrivateRoute>
            }
          />
          <Route
            path="/appointment_history"
            element={
              <PrivateRoute>
                <AppointmentHistory />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <PatientSettings />
              </PrivateRoute>
            }
          />
          {/* ✅ Catch all route - redirect to home */}
           <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}