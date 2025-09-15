export function FeaturesSection() {
  return (
    <section id="features" className=" py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Key Features
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Our system offers a range of features designed to streamline the appointment process and keep you informed.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-gray-50 p-6 transform hover:-translate-y-2 transition-transform duration-300">
            <div className="flex items-center justify-center size-12 rounded-full bg-[var(--primary-color)] text-white">
              <span className="material-symbols-outlined text-white bg-blue-700 rounded-full py-2 px-2">event_available</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Online Booking</h3>
            <p className="text-gray-600">
              Book your hospital appointments online at your convenience, avoiding long phone calls and waiting times.
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-gray-50 p-6 transform hover:-translate-y-2 transition-transform duration-300">
            <div className="flex items-center justify-center size-12 rounded-full bg-[var(--primary-color)] text-white">
              <span className="material-symbols-outlined text-white bg-blue-700 rounded-full py-2 px-2">update</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Real-Time Queue Updates</h3>
            <p className="text-gray-600">
              Stay updated on your appointment status with real-time queue information, allowing you to plan your visit effectively.
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-gray-50 p-6 transform hover:-translate-y-2 transition-transform duration-300">
            <div className="flex items-center justify-center size-12 rounded-full bg-[var(--primary-color)] text-white">
              <span className="material-symbols-outlined text-white bg-blue-700 rounded-full py-2 px-2">notifications_active</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Notifications</h3>
            <p className="text-gray-600">
              Receive timely notifications about your appointment, including reminders and any changes to the schedule.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
