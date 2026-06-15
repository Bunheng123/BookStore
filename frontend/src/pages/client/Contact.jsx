import React, { useState } from "react";

const ESPRESSO = "#1a1209";
const GOLD = "#d4af5f";
const PARCHMENT = "#f5f0e8";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="pt-32 pb-20 px-8">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
            style={{ color: ESPRESSO }}
          >
            Get in Touch
          </h1>
          <div className="h-1 w-20 mx-auto mb-6" style={{ background: GOLD }} />
          <p className="text-lg" style={{ color: "rgba(26,18,9,0.7)" }}>
            We'd love to hear from you. Reach out with any questions or
            feedback.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Contact Methods */}
          <div className="md:col-span-1">
            <h2
              className="text-lg font-semibold mb-8"
              style={{ color: ESPRESSO }}
            >
              Contact Information
            </h2>

            {/* Email */}
            <div className="mb-8">
              <div
                className="flex items-center gap-3 mb-2"
                style={{ color: GOLD }}
              >
                <span className="text-xl">✉</span>
                <h3 className="font-semibold text-sm">Email</h3>
              </div>
              <a
                href="mailto:info@folioink.com"
                className="text-sm no-underline transition-colors duration-200"
                style={{ color: "rgba(26,18,9,0.7)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(26,18,9,0.7)")
                }
              >
                info@folioink.com
              </a>
            </div>

            {/* Phone */}
            <div className="mb-8">
              <div
                className="flex items-center gap-3 mb-2"
                style={{ color: GOLD }}
              >
                <span className="text-xl">☎</span>
                <h3 className="font-semibold text-sm">Phone</h3>
              </div>
              <a
                href="tel:+1234567890"
                className="text-sm no-underline transition-colors duration-200"
                style={{ color: "rgba(26,18,9,0.7)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(26,18,9,0.7)")
                }
              >
                +1 (234) 567-890
              </a>
            </div>

            {/* Address */}
            <div className="mb-8">
              <div
                className="flex items-center gap-3 mb-2"
                style={{ color: GOLD }}
              >
                <span className="text-xl">📍</span>
                <h3 className="font-semibold text-sm">Address</h3>
              </div>
              <p className="text-sm" style={{ color: "rgba(26,18,9,0.7)" }}>
                123 Book Street
                <br />
                Literary City, LC 12345
                <br />
                United States
              </p>
            </div>

            {/* Hours */}
            <div>
              <div
                className="flex items-center gap-3 mb-2"
                style={{ color: GOLD }}
              >
                <span className="text-xl">🕒</span>
                <h3 className="font-semibold text-sm">Business Hours</h3>
              </div>
              <p className="text-sm" style={{ color: "rgba(26,18,9,0.7)" }}>
                Mon - Fri: 9:00 AM - 6:00 PM
                <br />
                Sat: 10:00 AM - 4:00 PM
                <br />
                Sun: Closed
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            {submitted && (
              <div
                className="mb-6 p-4 rounded border-l-4"
                style={{
                  background: `${GOLD}20`,
                  borderColor: GOLD,
                  color: ESPRESSO,
                }}
              >
                <p className="font-semibold text-sm">Message Received!</p>
                <p className="text-sm">
                  Thank you for contacting us. We'll get back to you soon.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: ESPRESSO }}
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  className="w-full px-4 py-3 text-sm border rounded outline-none transition-colors duration-200"
                  style={{
                    borderColor: formData.name ? GOLD : "#c8b99a",
                    color: ESPRESSO,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = GOLD;
                    e.currentTarget.style.boxShadow = `0 0 0 2px ${GOLD}20`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#c8b99a";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: ESPRESSO }}
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 text-sm border rounded outline-none transition-colors duration-200"
                  style={{
                    borderColor: formData.email ? GOLD : "#c8b99a",
                    color: ESPRESSO,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = GOLD;
                    e.currentTarget.style.boxShadow = `0 0 0 2px ${GOLD}20`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#c8b99a";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Subject */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: ESPRESSO }}
                >
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                  required
                  className="w-full px-4 py-3 text-sm border rounded outline-none transition-colors duration-200"
                  style={{
                    borderColor: formData.subject ? GOLD : "#c8b99a",
                    color: ESPRESSO,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = GOLD;
                    e.currentTarget.style.boxShadow = `0 0 0 2px ${GOLD}20`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#c8b99a";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Message */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: ESPRESSO }}
                >
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message..."
                  required
                  rows="6"
                  className="w-full px-4 py-3 text-sm border rounded outline-none transition-colors duration-200 resize-none"
                  style={{
                    borderColor: formData.message ? GOLD : "#c8b99a",
                    color: ESPRESSO,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = GOLD;
                    e.currentTarget.style.boxShadow = `0 0 0 2px ${GOLD}20`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#c8b99a";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-8 py-3 text-sm font-semibold uppercase tracking-wider rounded transition-all duration-300 cursor-pointer border-none"
                style={{
                  background: ESPRESSO,
                  color: PARCHMENT,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = GOLD;
                  e.currentTarget.style.color = ESPRESSO;
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 16px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = ESPRESSO;
                  e.currentTarget.style.color = PARCHMENT;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="border-t pt-16" style={{ borderColor: `${GOLD}40` }}>
          <h2
            className="text-2xl font-semibold mb-8 text-center"
            style={{ color: ESPRESSO }}
          >
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                q: "How long does shipping take?",
                a: "Standard shipping typically takes 5-7 business days. Express options are available.",
              },
              {
                q: "What is your return policy?",
                a: "We offer 30-day returns for unopened books in original condition with proof of purchase.",
              },
              {
                q: "Do you offer international shipping?",
                a: "Yes, we ship to most countries worldwide with varying shipping times and costs.",
              },
              {
                q: "Can I track my order?",
                a: "Yes, tracking information is provided via email once your order ships.",
              },
            ].map((faq, idx) => (
              <div key={idx}>
                <h3
                  className="font-semibold mb-2 text-sm"
                  style={{ color: GOLD }}
                >
                  Q: {faq.q}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(26,18,9,0.7)" }}
                >
                  A: {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
