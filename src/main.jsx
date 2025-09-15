// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import Index from "./Index.jsx";
import SignIn from "./auth/Login.jsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Homepage */}
        <Route path="/" element={<Index />} />

        {/* Login page */}
        <Route path="/login" element={<SignIn />} />

        {/* Dashboard (for after login) */}
        <Route path="/dashboard" element={<Index />} />

        {/* Fallback: redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
