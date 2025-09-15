import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    quote:
      "Using HealthConnect was a game-changer. I booked my appointment in minutes and the real-time updates meant I walked in just minutes before my turn. No more endless waiting!",
    name: "John Doe",
    role: "Verified Patient",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQDVGuhd8lIocz4mvXTzVeLTkiejls2GiuBHRvxU8jTN19dhC9yk84F7OCnLlI8r1ISVnqzrgXN9NtfVct6l6uQU3h2M2tkcmu5l8V7Y5sqjI1HhapmpTtbaASxn4Wq8Gk1jPEdmQBAcf6-PEYvg0Rwauh6crozM7y9nnsudMNNWtBXpnN99cKNX1lpcJY1pITi39R6YP42Yz0S6N59xCzQE8hFbiuYcrbPBjpSSXmBkPGLZrxAhwtHrD-AF6zUa_XwEgrBZPTAr3b",
  },
  {
    quote:
      "I was skeptical at first, but HealthConnect is incredibly efficient. The reminders are so helpful for my busy schedule, and I've saved hours of waiting time.",
    name: "Jane Smith",
    role: "Verified Patient",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKopFjoDiTMEkqIuhf2Dn8tydP9hnu2ZgKqSbCwWcoCOh9XuZDzn0RoQDi1-oa9zqRMm7nQAydCdMGu67bGeseI1zhQWhP2cQzkPWMStSAMm7tX0lmuR-0NbP84ajIGDbpvzcg4MDdT2pCDpg0niQdeOjbTr1wvc9a4ktB3ISWQe9kNhfACN6kZXJrC23d6p4Rbt6NkUFVbKEtOT7B6M0ImloD1tMDeqN7xBw8K00c-_-uRA2HIxakiZqI45jdIQX1aVDI22yPxbQ0",
  },
  {
    quote:
      "Finally, a system that respects patients' time. Booking online was simple, and knowing the queue status before leaving home made my hospital visit stress-free.",
    name: "Samuel Green",
    role: "Verified Patient",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMcX_p5Mrz3-GnIbh1arLvCdt082jlKLuAD3TmaPiNn30jaOZAlT5XhemEb_AVTqGiA1FZQfWbaYbUQLBFYc_Oak3odrntFBBtViBpZP1F1f2iBeN2kDcqxbhaL33IvQYJu7PkBiv66W6lNqbRo6zEusd77WRGMN_z47PJiQW5txl2H0Sn1LIn2NBy5ySGRM0iTRfxupgVV4RFTA-JNhHwlQS2IL8hK1Uc7I4rHsijHucDJBQTyoZr3nJpWWSqbp59oNj4MxJBLmnA",
  },
];

export function TestimonialSection() {
  const carouselRef = useRef(null);
  const intervalRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  // Scroll by one "page"
  const scrollByPage = (dir = 1) => {
    const el = carouselRef.current;
    if (!el) return;
    const step = el.clientWidth;
    const target = Math.max(
      0,
      Math.min(el.scrollLeft + dir * step, el.scrollWidth - el.clientWidth)
    );
    el.scrollTo({ left: target, behavior: "smooth" });
  };

  // Start auto-play
  const startAutoPlay = () => {
    stopAutoPlay();
    intervalRef.current = setInterval(() => scrollByPage(1), 5000);
  };

  // Stop auto-play
  const stopAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // Setup autoplay once on mount
  useEffect(() => {
    startAutoPlay();
    return stopAutoPlay;
  }, []);

  // Track scroll position to enable/disable buttons
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const update = () => {
      setCanPrev(el.scrollLeft > 0);
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section id="testimonials" className=" py-20 bg-gray-100/70">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            What Our Patients Are Saying
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Hear from those who've experienced the HealthConnect difference.
          </p>
        </div>

        <div
          className="relative max-w-5xl mx-auto overflow-hidden group"
          onMouseEnter={stopAutoPlay}
          onMouseLeave={startAutoPlay}
        >
          {/* Carousel */}
          <div
            ref={carouselRef}
            className="testimonial-carousel flex overflow-x-auto scroll-smooth snap-x snap-mandatory"
          >
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="testimonial-item flex-shrink-0 w-full flex flex-col items-center text-center p-8 snap-start"
              >
                <span className="material-symbols-outlined text-6xl text-[var(--primary-color)]">
                  format_quote
                </span>
                <blockquote className="text-xl italic text-gray-700 mt-4 max-w-2xl mx-auto">
                  {t.quote}
                </blockquote>
                <div className="mt-6 flex items-center gap-4">
                  <img
                    alt={t.name}
                    src={t.img}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-lg font-bold text-gray-900">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Prev Button */}
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => scrollByPage(-1)}
              disabled={!canPrev}
              className={`bg-white/60 hover:bg-white rounded-full pb-1 p-2 text-gray-700 shadow-md ${
                !canPrev ? "opacity-40 pointer-events-none" : ""
              }`}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
          </div>

          {/* Next Button */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => scrollByPage(1)}
              disabled={!canNext}
              className={`bg-white/60 hover:bg-white rounded-full pb-1 p-2 text-gray-700 shadow-md ${
                !canNext ? "opacity-40 pointer-events-none" : ""
              }`}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
