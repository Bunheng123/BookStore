import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE_URL, getApiUrl } from "../../apiConfig";
import BookCard from "../../components/BookCard";

const SPINE_COLORS = [
  "rgba(139,90,60,0.7)",
  "rgba(90,60,139,0.7)",
  "rgba(60,100,139,0.7)",
  "rgba(139,120,60,0.7)",
  "rgba(60,139,100,0.7)",
  "rgba(139,60,80,0.7)",
];

const PARCHMENT = "#f5f0e8";
const ESPRESSO = "#1a1209";
const GOLD = "#d4af5f";
const BROWN_MID = "#8a7560";
const BORDER_TAN = "#c8b99a";

// ── Intersection observer hook ───────────────────────────────────────────────
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

// ── Book Skeleton ────────────────────────────────────────────────────────────
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

// ── Main Browse Page ─────────────────────────────────────────────────────────
export default function Browse() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  const activeCat = searchParams.get("category") || "all";

  // ── Mount animation ──
  useEffect(() => {
    setTimeout(() => setMounted(true), 60);
  }, []);

  // ── Fetch books ──
  useEffect(() => {
    setLoading(true);
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
      .finally(() => setLoading(false));
  }, []);

  // ── Filter books ──
  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      search === "" ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      (b.author_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (b.category_name || "").toLowerCase().includes(search.toLowerCase());

    const matchesCat =
      activeCat === "all" || String(b.category_id) === activeCat;

    return matchesSearch && matchesCat;
  });

  const fadeIn = (delay = 0) => ({
    transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(24px)",
  });

  return (
    <div style={{ background: PARCHMENT, minHeight: "100vh" }}>
      {/* ══ HEADER BANNER ══ */}
      <section
        className="relative overflow-hidden"
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
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(212,175,95,0.1) 0%, transparent 65%)",
          }}
        />

        <div className="max-w-6xl mx-auto px-8 pt-32 pb-20">
          <div style={fadeIn(100)}>
            <div className="flex items-center gap-3 mb-6">
              <div
                className="h-px w-8"
                style={{ background: GOLD, opacity: 0.6 }}
              />
              <span
                className="text-[0.62rem] tracking-[0.38em] uppercase"
                style={{ color: GOLD }}
              >
                Our Collection
              </span>
            </div>
            <h1
              className="leading-[1.1] mb-4"
              style={{
                ...fadeIn(180),
                fontFamily: "Georgia, serif",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                color: PARCHMENT,
                fontWeight: 400,
              }}
            >
              Browse all <em style={{ color: GOLD }}>books</em>
            </h1>
            <p
              className="text-sm italic mb-8 max-w-lg"
              style={{ ...fadeIn(240), color: "rgba(245,240,232,0.45)" }}
            >
              Explore our full catalog — search by title, author, or genre to
              find your next great read.
            </p>

            {/* Search bar */}
            <div className="flex max-w-xl" style={fadeIn(300)}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, author or genre…"
                className="flex-1 px-5 py-3.5 outline-none text-sm italic"
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
                className="px-6 py-3.5 text-xs tracking-[0.2em] uppercase cursor-pointer border-none transition-colors duration-300"
                style={{ background: GOLD, color: ESPRESSO }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#c9a34a")
                }
                onMouseLeave={(e) => (e.currentTarget.style.background = GOLD)}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CATEGORY FILTERS ══ */}
      <section className="px-8 pt-10 pb-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2">
            {/* "All" pill */}
            <button
              onClick={() => {
                searchParams.delete("category");
                setSearchParams(searchParams);
              }}
              className="px-4 py-2 text-[0.65rem] tracking-[0.18em] uppercase cursor-pointer transition-all duration-300"
              style={{
                background: activeCat === "all" ? ESPRESSO : "transparent",
                color: activeCat === "all" ? PARCHMENT : ESPRESSO,
              }}
            >
              All ({books.length})
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSearchParams({ category: String(cat.id) })}
                className="px-4 py-2 text-[0.65rem] tracking-[0.18em] uppercase cursor-pointer transition-all duration-300"
                style={{
                  background:
                    activeCat === String(cat.id) ? ESPRESSO : "transparent",
                  color: activeCat === String(cat.id) ? PARCHMENT : ESPRESSO,
                }}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BOOKS GRID ══ */}
      <section className="px-8 pb-20 pt-6">
        <div className="max-w-6xl mx-auto">
          {/* Results count */}
          {!loading && !error && (
            <p
              className="text-xs italic mb-8"
              style={{ color: BROWN_MID, fontFamily: "Georgia, serif" }}
            >
              Showing {filteredBooks.length}{" "}
              {filteredBooks.length === 1 ? "book" : "books"}
              {activeCat !== "all" &&
                categories.find((c) => String(c.id) === activeCat) &&
                ` in ${categories.find((c) => String(c.id) === activeCat).name}`}
              {search && ` matching "${search}"`}
            </p>
          )}

          {/* Error state */}
          {error && (
            <div
              className="px-5 py-4 border-l-2 text-sm italic"
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
          {loading && !error && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <BookSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Books grid */}
          {!loading && !error && filteredBooks.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredBooks.map((book, i) => (
                <BookCard key={book.id} book={book} index={i} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filteredBooks.length === 0 && (
            <div className="text-center py-24">
              <p
                className="text-2xl italic mb-3"
                style={{ color: BROWN_MID, fontFamily: "Georgia, serif" }}
              >
                No books found.
              </p>
              <p className="text-sm italic mb-6" style={{ color: BORDER_TAN }}>
                Try adjusting your search or category filter.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  searchParams.delete("category");
                  setSearchParams(searchParams);
                }}
                className="px-6 py-3 text-xs tracking-[0.2em] uppercase border cursor-pointer bg-transparent transition-all duration-300"
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
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
