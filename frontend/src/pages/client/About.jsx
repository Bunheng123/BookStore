import React from "react";

const ESPRESSO = "#1a1209";
const GOLD = "#d4af5f";
const PARCHMENT = "#f5f0e8";

export default function About() {
  return (
    <div className="pt-32 pb-20 px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
            style={{ color: ESPRESSO }}
          >
            About Folio & Ink
          </h1>
          <div className="h-1 w-20 mx-auto mb-6" style={{ background: GOLD }} />
          <p className="text-lg" style={{ color: "rgba(26,18,9,0.7)" }}>
            A sanctuary for book lovers since 2024
          </p>
        </div>

        {/* Story Section */}
        <div className="mb-16">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ color: ESPRESSO }}
          >
            Our Story
          </h2>
          <div
            className="space-y-4 text-base leading-relaxed"
            style={{ color: "rgba(26,18,9,0.7)" }}
          >
            <p>
              Founded with a passion for literature and a love for timeless
              books, Folio & Ink was born from a simple vision: to create a
              space where readers can discover their next favorite book. Our
              name reflects the essence of literature—the ink on the pages and
              the binding of a folio that holds countless stories.
            </p>
            <p>
              We believe that books have the power to transform lives, transport
              minds to distant worlds, and connect souls across generations.
              That's why we've curated our collection with care, selecting each
              title to bring joy, knowledge, and inspiration to our customers.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ color: ESPRESSO }}
          >
            Our Mission
          </h2>
          <div className="p-8 rounded" style={{ background: `${GOLD}15` }}>
            <p
              className="text-base leading-relaxed"
              style={{ color: "rgba(26,18,9,0.8)" }}
            >
              To be your trusted literary companion, offering a diverse
              selection of books across all genres while providing exceptional
              service and fostering a community of passionate readers who
              celebrate the written word.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2
            className="text-2xl font-semibold mb-8"
            style={{ color: ESPRESSO }}
          >
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Quality",
                desc: "We handpick every book to ensure the finest reading experience",
              },
              {
                title: "Accessibility",
                desc: "Making literature available to readers of all interests and budgets",
              },
              {
                title: "Community",
                desc: "Building connections between readers and fostering a love for books",
              },
            ].map((value, idx) => (
              <div key={idx} className="text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: GOLD, color: ESPRESSO }}
                >
                  <span className="text-xl font-bold">{idx + 1}</span>
                </div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: ESPRESSO }}
                >
                  {value.title}
                </h3>
                <p className="text-sm" style={{ color: "rgba(26,18,9,0.6)" }}>
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <h2
            className="text-2xl font-semibold mb-8"
            style={{ color: ESPRESSO }}
          >
            Why Choose Us
          </h2>
          <ul className="space-y-4">
            {[
              "Curated collection of books across all genres and interests",
              "Fast and reliable shipping to get your books quickly",
              "Competitive pricing with regular offers and discounts",
              "Expert staff ready to help you find your next read",
              "Secure and easy online shopping experience",
              "Community events and book discussions",
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-4">
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mt-0.5"
                  style={{ background: GOLD, color: ESPRESSO }}
                >
                  ✓
                </span>
                <span style={{ color: "rgba(26,18,9,0.7)" }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-[#f5f0e8] to-[#e8dcc8] p-12 rounded">
          <h3
            className="text-2xl font-semibold mb-3"
            style={{ color: ESPRESSO }}
          >
            Ready to Explore?
          </h3>
          <p className="mb-6" style={{ color: "rgba(26,18,9,0.7)" }}>
            Discover hundreds of books waiting to be discovered
          </p>
          <a
            href="/browse"
            className="inline-block px-8 py-3 text-sm font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer border-none"
            style={{
              background: ESPRESSO,
              color: PARCHMENT,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = GOLD;
              e.currentTarget.style.color = ESPRESSO;
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = ESPRESSO;
              e.currentTarget.style.color = PARCHMENT;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Browse Books
          </a>
        </div>
      </div>
    </div>
  );
}
