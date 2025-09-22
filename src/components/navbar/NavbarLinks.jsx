// src/components/navbar/NavbarLinks.jsx
import {PrimaryButton} from '../button/Button'

import { Link } from "react-router-dom";
import {BookingSection} from '../hero/Hero'


// Main NavLinks 
export function NavbarLinks({ items, isMobile = false }) {
    const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <ul className={`flex items-center ${isMobile ? "flex-col space-y-2" : "space-x-10"}`}>
      {items.map((item) => (
        <li key={item.href}>
          <button
            href={item.href}
             onClick={() => scrollToSection(item.href)}
            className="text-gray-700 transition-colors duration-200 cursor-pointer hover:text-blue-600"
          >
            {item.label}
          </button>
        </li>
      ))}
      <li><Link to ="/login"><PrimaryButton onClick={BookingSection}>Book An Appointment</PrimaryButton></Link></li>
    </ul>
  );
}

// Navlinks For Login Page 
export function NavbarLinksLogin() {
  return (
    <ul className={`flex items-center space-x-10`}>
      <li><Link  to="/register"><PrimaryButton>Register</PrimaryButton></Link></li>
    </ul>
  );
}

// Navlinks For Signup Page 
export function NavbarLinksSignup() {
  return (
    <ul className={`flex items-center space-x-10`}>
      <li><Link to="/login"><PrimaryButton>Login</PrimaryButton></Link></li>
    </ul>
  );
}
