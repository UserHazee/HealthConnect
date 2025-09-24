import { SecondaryButton } from "../button/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export function BookingSection() {
  const navigate = useNavigate();
  const { token, user, loading } = useAuth(); // 👈 get user + loading

  const handleBookAppointment = () => {
    if (loading) return; // 🚫 don’t navigate while still fetching user

    if (token && user) {
      navigate("/dashboard"); // ✅ only go if user confirmed
    } else {
      navigate("/login");
    }
  };

  return (
    <section
      className="relative mt-16 flex min-h-[calc(100vh-68px)] items-center justify-center bg-cover bg-center py-20 text-white"
      id="booking"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.7) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAMJx-CxTBJbVV612sRlFOmPA5H_tB7kd0BHQWImf99AHHjeE0P7qRStVP2Qmx788n2YX2_RZ_QAhot4B74Q8z5GUt0caWIvB5AHk6BH5jV9ehW-MWDKtrRbnBT6ySWQAyuHOAhbrUq0Za2mEjURfUwIUKLyOrcaHDwBBNgHdvQuFmHPh91gsore5gV3q7C57OETNaBBeWHgSxy3gjYHGIo4WTXy5I78UdZEgF2HlfKVL5CPQWcV5v4yMVWHbht6CH9GHfC_eI1f4MT")`
      }}
    >
      <div className="container px-4 mx-auto text-center">
        <h1 className="text-4xl font-black leading-tight tracking-tight md:text-6xl">
          Reduce Your Hospital Waiting Time
        </h1>
        <p className="max-w-3xl mx-auto mt-4 text-lg font-normal leading-normal text-gray-200">
          HealthConnect provides a seamless online appointment booking system
          for public hospitals, minimizing wait times and enhancing patient
          experience.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <SecondaryButton onClick={handleBookAppointment}>
            Book an Appointment
          </SecondaryButton>
        </div>
      </div>
    </section>
  );
}
