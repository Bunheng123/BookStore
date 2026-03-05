import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, getApiUrl } from "../../apiConfig";
import BookCard from "../../components/BookCard";
import Carousel from "../../components/Carousel";

const QUOTES = [
  {
    text: "A reader lives a thousand lives before he dies.",
    author: "George R.R. Martin",
  },
  {
    text: "There is no friend as loyal as a book.",
    author: "Ernest Hemingway",
  },
  { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
];

const PARCHMENT = "#f5f0e8";
const ESPRESSO = "#1a1209";
const GOLD = "#d4af5f";
const BROWN_MID = "#8a7560";
const BORDER_TAN = "#c8b99a";

const SPINE_COLORS = [
  "rgba(139,90,60,0.7)",
  "rgba(90,60,139,0.7)",
  "rgba(60,100,139,0.7)",
  "rgba(139,120,60,0.7)",
  "rgba(60,139,100,0.7)",
  "rgba(139,60,80,0.7)",
];

function useIntersection(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

// ── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ label, title }) {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  return (
    <div
      ref={ref}
      style={{
        transition: "opacity 0.7s ease, transform 0.7s ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="h-px w-6" style={{ background: GOLD, opacity: 0.5 }} />
        <span
          className="text-[0.62rem] tracking-[0.32em] uppercase"
          style={{ color: GOLD }}
        >
          {label}
        </span>
      </div>
      <h2
        className="text-3xl xl:text-4xl font-normal"
        style={{ color: ESPRESSO, fontFamily: "Georgia, serif" }}
      >
        {title}
      </h2>
    </div>
  );
}

// ── Book Skeleton (loading placeholder) ─────────────────────────────────────
function BookSkeleton() {
  return (
    <div className="animate-pulse">
      <div
        className="mb-4 rounded"
        style={{ aspectRatio: "2/3", background: "#e5ddd0" }}
      />
      <div
        className="h-3 rounded mb-2"
        style={{ background: "#e5ddd0", width: "80%" }}
      />
      <div
        className="h-2.5 rounded mb-3"
        style={{ background: "#e5ddd0", width: "55%" }}
      />
      <div className="flex justify-between items-center">
        <div
          className="h-3 rounded"
          style={{ background: "#e5ddd0", width: "30%" }}
        />
        <div
          className="h-7 rounded"
          style={{ background: "#e5ddd0", width: "35%" }}
        />
      </div>
    </div>
  );
}

// ── Category Card (built from book data) ─────────────────────────────────────
function CategoryCard({ cat, index }) {
  const navigate = useNavigate();
  const ref = useRef(null);
  const visible = useIntersection(ref);

  const ICONS = {
    Fiction: "📖",
    "Self-Help": "🌱",
    History: "🏛️",
    "Sci-Fi": "🚀",
    Romance: "🌹",
    Classic: "✒️",
    Mystery: "🔍",
    Biography: "👤",
    Science: "🔬",
    Children: "🧒",
    Poetry: "🖋️",
    Travel: "🌍",
  };

  return (
    <div
      ref={ref}
      onClick={() => navigate(`/browse?category=${cat.id}`)}
      className="group cursor-pointer flex flex-col items-center gap-2 py-6 px-4 border transition-colors duration-300"
      style={{
        borderColor: BORDER_TAN,
        transition: `opacity 0.5s ease ${index * 60}ms, transform 0.5s ease ${index * 60}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = ESPRESSO;
        e.currentTarget.style.borderColor = ESPRESSO;
        const textEl = e.currentTarget.querySelector("p:first-of-type");
        if (textEl) textEl.style.color = PARCHMENT;
        const countEl = e.currentTarget.querySelector("p:last-of-type");
        if (countEl) countEl.style.color = PARCHMENT;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.borderColor = BORDER_TAN;
        const textEl = e.currentTarget.querySelector("p:first-of-type");
        if (textEl) textEl.style.color = ESPRESSO;
        const countEl = e.currentTarget.querySelector("p:last-of-type");
        if (countEl) countEl.style.color = BROWN_MID;
      }}
    >
      <span className="text-2xl">{ICONS[cat.name] || "📚"}</span>
      <p
        className="text-xs tracking-[0.18em] uppercase transition-colors duration-300"
        style={{ color: ESPRESSO }}
      >
        {cat.name}
      </p>
      <p
        className="text-[0.65rem] transition-colors duration-300"
        style={{ color: BROWN_MID }}
      >
        {cat.count} books
      </p>
    </div>
  );
}

// ── Quote Banner ─────────────────────────────────────────────────────────────
function QuoteBanner() {
  const ref = useRef(null);
  const visible = useIntersection(ref, 0.3);
  return (
    <section
      ref={ref}
      className="py-24 px-8 relative overflow-hidden"
      style={{ background: ESPRESSO }}
    >
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 39px, rgba(212,175,95,1) 39px, rgba(212,175,95,1) 40px)`,
        }}
      />
      <div
        className="max-w-3xl mx-auto text-center"
        style={{
          transition: "opacity 0.9s ease, transform 0.9s ease",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
        }}
      >
        <div className="flex justify-center items-center gap-3 mb-6">
          <div
            className="h-px w-10"
            style={{ background: GOLD, opacity: 0.4 }}
          />
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: GOLD, opacity: 0.4 }}
          />
          <div
            className="h-px w-10"
            style={{ background: GOLD, opacity: 0.4 }}
          />
        </div>
        <p
          className="text-2xl xl:text-3xl italic leading-relaxed mb-6"
          style={{ color: PARCHMENT, fontFamily: "Georgia, serif" }}
        >
          "The more that you read, the more things you will{" "}
          <span style={{ color: GOLD }}>know.</span>"
        </p>
        <p
          className="text-xs tracking-[0.25em] uppercase"
          style={{ color: "rgba(245,240,232,0.3)" }}
        >
          — Dr. Seuss
        </p>
      </div>
    </section>
  );
}

// ── Main Home ─────────────────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate();

  const [mounted, setMounted] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [search, setSearch] = useState("");

  // ── Data from API ──
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [error, setError] = useState(null);

  // ── Mount animation ──
  useEffect(() => {
    setTimeout(() => setMounted(true), 60);
  }, []);

  // ── Rotate quotes ──
  useEffect(() => {
    const t = setInterval(
      () => setQuoteIdx((i) => (i + 1) % QUOTES.length),
      5000,
    );
    return () => clearInterval(t);
  }, []);

  // ── Fetch books from API ──
  useEffect(() => {
    setLoadingBooks(true);
    setError(null);

    fetch(getApiUrl("api/books"))
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.status === "success") {
          setBooks(data.data);

          // Build categories from book data
          // Expects book to have category_id + category_name from a JOIN
          // If your /books endpoint doesn't return category_name yet, see note below
          const catMap = {};
          data.data.forEach((book) => {
            const id = book.category_id;
            const name = book.category_name || `Category ${id}`;
            if (!catMap[id]) catMap[id] = { id, name, count: 0 };
            catMap[id].count++;
          });
          setCategories(Object.values(catMap));
        } else {
          throw new Error(data.message || "Failed to load books");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoadingBooks(false));
  }, []);

  // ── Filter books by search ──
  const filteredBooks = books.filter(
    (b) =>
      search === "" ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      (b.author_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (b.category_name || "").toLowerCase().includes(search.toLowerCase()),
  );

  const featuredBooks = filteredBooks.slice(0, 6);

  const fadeIn = (delay = 0) => ({
    transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(24px)",
  });

  return (
    <div>
      {/* ══ HERO ══ */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: ESPRESSO }}
      >
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg,  transparent, transparent 39px, rgba(212,175,95,1) 39px, rgba(212,175,95,1) 40px),
              repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(212,175,95,1) 39px, rgba(212,175,95,1) 40px)
            `,
          }}
        />
        {/* Glow */}
        <div
          className="absolute -top-64 -left-64 w-200 h-200 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(212,175,95,0.1) 0%, transparent 65%)",
          }}
        />
        {/* Decorative spines */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden xl:flex gap-3 items-end">
          {[160, 110, 200, 140, 180, 100, 220, 130, 170].map((h, i) => (
            <div
              key={i}
              className="w-4 rounded-sm"
              style={{
                height: `${h}px`,
                background: SPINE_COLORS[i % SPINE_COLORS.length],
                borderTop: `3px solid ${GOLD}`,
                opacity: 0.35 + i * 0.04,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-8 pt-32 pb-16 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-8" style={fadeIn(100)}>
              <div
                className="h-px w-8"
                style={{ background: GOLD, opacity: 0.6 }}
              />
              <span
                className="text-[0.62rem] tracking-[0.38em] uppercase"
                style={{ color: GOLD }}
              >
                Folio & Ink Bookstore
              </span>
            </div>

            <h1
              className="leading-[1.1] mb-6"
              style={{
                ...fadeIn(180),
                fontFamily: "Georgia, serif",
                fontSize: "clamp(2.8rem, 6vw, 5rem)",
                color: PARCHMENT,
                fontWeight: 400,
              }}
            >
              Your next great <em style={{ color: GOLD }}>adventure</em>
              <br />
              awaits.
            </h1>

            {/* Rotating quotes */}
            <div
              className="mb-10 h-12 overflow-hidden relative"
              style={fadeIn(260)}
            >
              {QUOTES.map((q, i) => (
                <p
                  key={i}
                  className="italic text-base leading-relaxed absolute inset-0"
                  style={{
                    color: "rgba(245,240,232,0.45)",
                    fontFamily: "Georgia, serif",
                    transition: "opacity 0.8s ease, transform 0.8s ease",
                    opacity: i === quoteIdx ? 1 : 0,
                    transform:
                      i === quoteIdx ? "translateY(0)" : "translateY(8px)",
                  }}
                >
                  "{q.text}" — {q.author}
                </p>
              ))}
            </div>

            {/* Search */}
            <div className="flex mb-10" style={fadeIn(340)}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, author or genre…"
                className="flex-1 px-5 py-4 outline-none text-sm italic"
                style={{
                  background: "rgba(245,240,232,0.08)",
                  border: "1px solid rgba(200,185,154,0.3)",
                  borderRight: "none",
                  color: PARCHMENT,
                  fontFamily: "Georgia, serif",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = GOLD)}
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(200,185,154,0.3)")
                }
              />
              <button
                className="px-6 py-4 text-xs tracking-[0.2em] uppercase cursor-pointer border-none transition-colors duration-300"
                style={{ background: GOLD, color: ESPRESSO }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#c9a34a")
                }
                onMouseLeave={(e) => (e.currentTarget.style.background = GOLD)}
              >
                Search
              </button>
            </div>

            {/* CTAs */}
            <div className="flex gap-4 flex-wrap" style={fadeIn(420)}>
              <button
                onClick={() => navigate("/browse")}
                className="px-8 py-3.5 text-xs tracking-[0.25em] uppercase relative overflow-hidden group cursor-pointer border-none"
                style={{ background: PARCHMENT, color: ESPRESSO }}
              >
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: GOLD }}
                />
                <span className="relative group-hover:text-[#1a1209] transition-colors duration-300">
                  Browse All Books
                </span>
              </button>
              <button
                onClick={() => navigate("/cart")}
                className="px-8 py-3.5 text-xs tracking-[0.25em] uppercase border cursor-pointer bg-transparent transition-all duration-300"
                style={{
                  color: PARCHMENT,
                  borderColor: "rgba(245,240,232,0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = GOLD;
                  e.currentTarget.style.color = GOLD;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(245,240,232,0.3)";
                  e.currentTarget.style.color = PARCHMENT;
                }}
              >
                View Cart
              </button>
            </div>
          </div>
        </div>

        {/* Diagonal cut */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{
            background: PARCHMENT,
            clipPath: "polygon(0 100%, 100% 0, 100% 100%)",
          }}
        />
      </section>

      {/* ══ CATEGORIES ══ */}
      {categories.length > 0 && (
        <section className="py-20 px-8" style={{ background: PARCHMENT }}>
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              label="Explore"
              title={
                <>
                  Browse by <em>genre</em>
                </>
              }
            />
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-10">
              {categories.slice(0, 6).map((cat, i) => (
                <CategoryCard key={cat.id} cat={cat} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ FEATURED BOOKS ══ */}
      <section className="py-20 px-8" style={{ background: "#ede8de" }}>
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            label="Curated Picks"
            title={
              search ? (
                <>
                  Search <em>results</em>
                </>
              ) : (
                <>
                  Featured <em>this month</em>
                </>
              )
            }
          />

          {/* Error state */}
          {error && (
            <div
              className="mt-10 px-5 py-4 border-l-2 text-sm italic"
              style={{
                borderColor: "#8b3a3a",
                color: "#8b3a3a",
                background: "rgba(139,58,58,0.05)",
              }}
            >
              Could not load books: {error}
            </div>
          )}

          {/* Loading skeletons */}
          {loadingBooks && !error && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-10">
              {Array.from({ length: 6 }).map((_, i) => (
                <BookSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Books grid */}
          {!loadingBooks && !error && featuredBooks.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-10">
              {featuredBooks.map((book, i) => (
                <BookCard key={book.id} book={book} index={i} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loadingBooks && !error && featuredBooks.length === 0 && (
            <div className="mt-10 text-center py-16">
              <p
                className="text-2xl italic mb-2"
                style={{ color: BROWN_MID, fontFamily: "Georgia, serif" }}
              >
                No books found.
              </p>
              <p className="text-sm italic" style={{ color: BORDER_TAN }}>
                Try a different search term.
              </p>
            </div>
          )}

          {/* View all */}
          {!loadingBooks && books.length > 6 && (
            <div className="text-center mt-12">
              <button
                onClick={() => navigate("/browse")}
                className="px-10 py-3.5 text-xs tracking-[0.25em] uppercase border transition-all duration-300 cursor-pointer bg-transparent"
                style={{ color: ESPRESSO, borderColor: BORDER_TAN }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = ESPRESSO;
                  e.currentTarget.style.color = PARCHMENT;
                  e.currentTarget.style.borderColor = ESPRESSO;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = ESPRESSO;
                  e.currentTarget.style.borderColor = BORDER_TAN;
                }}
              >
                View All {books.length} Books
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
