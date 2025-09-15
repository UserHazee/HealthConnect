export function FAQSection() {
  const faqs = [
    {
      question: "How do I book an appointment?",
      answer:
        "To book an appointment, simply log in to your HealthConnect account, select your desired hospital and department, choose an available time slot, and confirm your booking. You will receive a confirmation notification immediately.",
    },
    {
      question: "Can I cancel or reschedule my appointment?",
      answer:
        "Yes, you can cancel or reschedule your appointment through the patient portal. Please do so at least 24 hours in advance to allow other patients to take the slot.",
    },
    {
      question: "How is my personal data protected?",
      answer:
        "We take data privacy very seriously. All personal and medical information is encrypted and stored securely in compliance with healthcare data protection regulations. Your data is only accessible to authorized hospital staff.",
    },
    {
      question: "What happens if I miss my appointment?",
      answer:
        "If you miss your appointment without prior cancellation, it will be marked as a 'no-show'. Repeated no-shows may affect your ability to book future appointments online. We recommend rescheduling if you know you cannot make it.",
    },
    {
      question: "Is this service free?",
      answer:
        "Yes, using the HealthConnect booking platform is completely free for patients. The service is provided by public hospitals to improve accessibility and efficiency.",
    },
  ];

  return (
    <section className="py-20 bg-white" id="faq">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Find answers to common questions about the HealthConnect system.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group rounded-lg bg-gray-50 p-6 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                <h3 className="text-lg font-medium">{faq.question}</h3>
                <span className="relative size-5 shrink-0">
                  <span className="material-symbols-outlined absolute inset-0 size-5 opacity-100 group-open:opacity-0 transition-opacity">
                    add
                  </span>
                  <span className="material-symbols-outlined absolute inset-0 size-5 opacity-0 group-open:opacity-100 transition-opacity">
                    remove
                  </span>
                </span>
              </summary>
              <p className="mt-4 leading-relaxed text-gray-700">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
