// src/components/navbar/Navbar.jsx
import { useState } from "react";
import { NavbarBrand } from "./NavbarBrand";
import { NavbarLinks } from "./NavbarLinks";
import { NavbarToggle } from "./NavbarToggle";
import { NavbarLinksLogin } from "./NavbarLinks";

const navItems = [
  { label: "Features", href: "features" },
  { label: "Testimonials", href: "testimonials" },
  { label: "FAQ", href: "faq" }
];
// This is my Main Navbar
export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* {Brand} */}
                    <NavbarBrand title="HealthConnect" href="/" />

                    {/* Desktop Links */}
                    <div className="hidden space-x-8 md:flex">
                        <NavbarLinks items={navItems} />
                    </div>

                    {/* Mobile Menu Button */}
                    <NavbarToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="h-[100vh] px-4 pb-4 bg-accent md:hidden">
                    <NavbarLinks items={navItems} isMobile />
                </div>
            )}
        </header>
    );
}

// This is for Login Page Navbar
export function NavbarLogin() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* {Brand} */}
                    <NavbarBrand title="HealthConnect" href="/" />

                     {/* Desktop Links */}
                    <div className="space-x-8 flex">
                        <NavbarLinksLogin items={navItems} />
                    </div>
                </div>
            </div>

         
        </header>
    );
}