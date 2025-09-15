export function Footer() {
    return (
        <footer className="bg-gray-800 text-white pt-12 pb-8">
            <div className="container mx-auto px-6 lg:px-8">
                {/* Grid Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="inline" width="35" height="35" viewBox="0 0 512 512"><path fill="#FFFFFF" fill-rule="evenodd" d="M433.256 101.735c29.053 30.388 40.558 72.179 34.517 111.598h-43.409c6.515-28.563-.801-59.995-21.948-82.113c-31.299-32.737-81.216-32.737-112.515 0L256 166.679l-33.902-35.46c-31.299-32.737-81.216-32.737-112.515 0c-21.147 22.119-28.463 53.551-21.948 82.114H44.227c-6.042-39.419 5.464-81.211 34.516-111.599c44.631-46.68 114.991-50.05 163.335-10.107a127 127 0 0 1 10.86 10.107l3.062 3.203l3.061-3.202c3.472-3.631 7.099-7 10.86-10.108c48.345-39.943 118.704-36.574 163.335 10.108M360.14 298.667h59.03L256 469.333L92.83 298.667h59.029L256 407.592zM192 122.964l-55.872 111.703H42.667v42.666h119.851L192 218.368l64 128.001l34.517-69.036h178.816v-42.666H311.851L288 186.964l-32 63.98z" clip-rule="evenodd" /></svg>
                            <h2 className="text-white text-xl font-bold">HealthConnect</h2>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Simplifying your access to healthcare, one appointment at a time.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    className="text-gray-400 hover:text-white transition-colors"
                                    href="#features"
                                >
                                    Features
                                </a>
                            </li>
                            <li>
                                <a
                                    className="text-gray-400 hover:text-white transition-colors"
                                    href="#testimonials"
                                >
                                    Testimonials
                                </a>
                            </li>
                            <li>
                                <a
                                    className="text-gray-400 hover:text-white transition-colors"
                                    href="#faq"
                                >
                                    FAQ
                                </a>
                            </li>
                            <li>
                                <a
                                    className="text-gray-400 hover:text-white transition-colors"
                                    href="#booking"
                                >
                                    Book Now
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    className="text-gray-400 hover:text-white transition-colors"
                                    href="#"
                                >
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a
                                    className="text-gray-400 hover:text-white transition-colors"
                                    href="#"
                                >
                                    Terms of Service
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li className="flex items-start">
                                <span className="material-symbols-outlined text-lg mr-2 mt-1">
                                    location_on
                                </span>
                                <span>123 Health St, Wellness City, HC 45678</span>
                            </li>
                            <li className="flex items-center">
                                <span className="material-symbols-outlined text-lg mr-2">call</span>
                                <a
                                    className="hover:text-white transition-colors"
                                    href="tel:+1234567890"
                                >
                                    (123) 456-7890
                                </a>
                            </li>
                            <li className="flex items-center">
                                <span className="material-symbols-outlined text-lg mr-2">email</span>
                                <a
                                    className="hover:text-white transition-colors"
                                    href="mailto:contact@healthconnect.com"
                                >
                                    contact@healthconnect.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-8 border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between">
                    <p className="text-sm text-gray-400">
                        © 2024 HealthConnect. All rights reserved.
                    </p>

                    {/* Social Links */}
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <a
                            className="text-gray-400 hover:text-white transition-colors"
                            href="#"
                        >
                            <svg
                                aria-hidden="true"
                                className="h-6 w-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 
                  3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797
                  c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 
                  2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 
                  1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 
                  21.128 22 16.991 22 12z"
                                />
                            </svg>
                        </a>
                        <a
                            className="text-gray-400 hover:text-white transition-colors"
                            href="#"
                        >
                            <svg
                                aria-hidden="true"
                                className="h-6 w-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 
                11.675-11.675 0-.178 0-.355-.012-.53A8.348 
                8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 
                4.118 4.118 0 001.804-2.27 8.224 8.224 
                0 01-2.605.996 4.107 4.107 0 00-6.993 
                3.743 11.65 11.65 0 01-8.457-4.287 
                4.106 4.106 0 001.27 5.477A4.072 
                4.072 0 012.8 9.71v.052a4.105 4.105 
                0 003.292 4.022 4.095 4.095 0 
                01-1.853.07 4.108 4.108 0 003.834 
                2.85A8.233 8.233 0 012 18.407a11.616 
                11.616 0 006.29 1.84"></path>
                            </svg>
                        </a>
                        <a
                            className="text-gray-400 hover:text-white transition-colors"
                            href="#"
                        >
                            <svg
                                aria-hidden="true"
                                className="h-6 w-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M12 2C6.477 2 2 6.477 2 12.011c0 
                  4.434 2.865 8.18 6.839 9.504.5.092.682-.217.682-.482 
                  0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343
                  -.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 
                  1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 
                  1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22
                  -.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 
                  1.031-2.688-.103-.253-.446-1.272.098-2.65 
                  0 0 .84-.27 2.75 1.026A9.564 9.564 
                  0 0112 6.844c.85.004 1.705.115 2.504.337 
                  1.909-1.296 2.747-1.027 2.747-1.027.546 
                  1.379.203 2.398.1 2.651.64.7 1.03 
                  1.595 1.03 2.688 0 3.848-2.338 
                  4.695-4.566 4.942.359.308.678.92.678 
                  1.855 0 1.338-.012 2.419-.012 2.747 
                  0 .268.18.58.688.482A10.001 10.001 
                  0 0022 12.011C22 6.477 17.523 2 12 2z"
                                />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
