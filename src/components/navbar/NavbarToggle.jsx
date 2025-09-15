// src/components/navbar/NavbarToggle.jsx
import { Menu, X } from "lucide-react"; // icon library

export function NavbarToggle({ isOpen, onClick }) {
  return (
    <button
      onClick={onClick}
      className="p-2 text-gray-700 rounded-md md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );
}
