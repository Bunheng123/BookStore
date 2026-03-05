import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { API_BASE_URL, getApiUrl } from "../../apiConfig";
import Carousel from "../../components/Carousel";

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

// ── Skeleton loader ──────────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <div style={{ background: PARCHMENT, minHeight: "100vh" }}>
      {/* Hero skeleton */}
      <div
        className="animate-pulse"
        style={{ background: ESPRESSO, height: "260px" }}
      />

      {/* Body skeleton */}
      <div className="max-w-5xl mx-auto px-8 py-16">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Cover skeleton */}
          <div className="w-full md:w-[340px] shrink-0">
            <div
              className="animate-pulse rounded"
              style={{ aspectRatio: "2/3", background: "#e5ddd0" }}
            />
          </div>
          {/* Info skeleton */}
          <div className="flex-1 space-y-5 pt-2">
            <div
              className="h-4 rounded animate-pulse"
              style={{ background: "#e5ddd0", width: "40%" }}
            />
            <div
              className="h-8 rounded animate-pulse"
              style={{ background: "#e5ddd0", width: "80%" }}
            />
            <div
              className="h-3 rounded animate-pulse"
              style={{ background: "#e5ddd0", width: "35%" }}
            />
            <div className="h-px mt-6" style={{ background: "#e5ddd0" }} />
            <div className="space-y-3 pt-4">
              <div
                className="h-3 rounded animate-pulse"
                style={{ background: "#e5ddd0", width: "100%" }}
              />
              <div
                className="h-3 rounded animate-pulse"
                style={{ background: "#e5ddd0", width: "90%" }}
              />
              <div
                className="h-3 rounded animate-pulse"
                style={{ background: "#e5ddd0", width: "75%" }}
              />
            </div>
            <div className="flex gap-4 pt-6">
              <div
                className="h-12 rounded animate-pulse"
                style={{ background: "#e5ddd0", width: "130px" }}
              />
              <div
                className="h-12 rounded animate-pulse"
                style={{ background: "#e5ddd0", width: "160px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main BookDetail ──────────────────────────────────────────────────────────
export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [qty, setQty] = useState(1);
  const [imgError, setImgError] = useState(false);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  const { addToCart } = useCart();

  // ── Mount fade-in ──
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  // ── Fetch book ──
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(getApiUrl(`api/books/${id}`))
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.status === "success") {
          setBook(data.data);
        } else {
          throw new Error(data.message || "Book not found");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // ── Fetch related books by category ──
  useEffect(() => {
    if (!book || !book.category_id) return;

    setLoadingRelated(true);
    fetch(getApiUrl(`api/books?category_id=${book.category_id}`))
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.status === "success") {
          // Filter out the current book and limit to 10
          const filtered = data.data
            .filter((b) => b.id !== book.id)
            .slice(0, 10);
          setRelatedBooks(filtered);
        }
      })
      .catch((err) => console.error("Error loading related books:", err))
      .finally(() => setLoadingRelated(false));
  }, [book]);

  // ── Loading state ──
  if (loading) return <DetailSkeleton />;

  // ── Error state ──
  if (error || !book) {
    return (
      <div style={{ background: PARCHMENT, minHeight: "100vh" }}>
        {/* Mini header */}
        <div
          style={{
            background: ESPRESSO,
            paddingTop: "120px",
            paddingBottom: "60px",
          }}
        >
          <div className="max-w-5xl mx-auto px-8">
            <button
              onClick={() => navigate("/browse")}
              className="flex items-center gap-2 text-xs tracking-[0.18em] uppercase bg-transparent border-none cursor-pointer transition-colors duration-200"
              style={{ color: "rgba(245,240,232,0.45)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(245,240,232,0.45)")
              }
            >
              ← Back to Browse
            </button>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-8 py-20 text-center">
          <p
            className="text-3xl italic mb-4"
            style={{ color: BROWN_MID, fontFamily: "Georgia, serif" }}
          >
            {error || "Book not found."}
          </p>
          <p className="text-sm italic mb-8" style={{ color: BORDER_TAN }}>
            The book you're looking for may have been removed or doesn't exist.
          </p>
          <button
            onClick={() => navigate("/browse")}
            className="px-8 py-3 text-xs tracking-[0.2em] uppercase border cursor-pointer bg-transparent transition-all duration-300"
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
            Browse All Books
          </button>
        </div>
      </div>
    );
  }

  const spineCol = SPINE_COLORS[(book.id || 0) % SPINE_COLORS.length];
  const hasImage = book.book_img && !imgError;
  const inStock = book.stock > 0;
  const lowStock = book.stock > 0 && book.stock <= 5;

  const fadeIn = (delay = 0) => ({
    transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(24px)",
  });

  return (
    <div style={{ background: PARCHMENT, minHeight: "100vh" }}>
      {/* ══════════ HERO BANNER ══════════ */}
      <section
        className="relative overflow-hidden"
        style={{ background: ESPRESSO }}
      >
        {/* Glow */}
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(212,175,95,0.1) 0%, transparent 65%)",
          }}
        />

        <div className="max-w-5xl mx-auto px-8 pt-32 pb-16 relative">
          {/* Back link */}
          <div style={fadeIn(60)}>
            <button
              onClick={() => navigate("/browse")}
              className="flex items-center gap-2 text-xs tracking-[0.18em] uppercase bg-transparent border-none cursor-pointer transition-colors duration-200 mb-8"
              style={{ color: "rgba(245,240,232,0.45)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(245,240,232,0.45)")
              }
            >
              ← Back to Browse
            </button>
          </div>

          {/* Category badge */}
          <div style={fadeIn(120)}>
            <div className="flex items-center gap-3 mb-5">
              <span
                className="text-[0.62rem] tracking-[0.38em] uppercase"
                style={{ color: GOLD }}
              >
                {book.category_name || "Uncategorized"}
              </span>
            </div>
          </div>

          {/* Title */}
          <h1
            className="leading-[1.1] mb-4"
            style={{
              ...fadeIn(200),
              fontFamily: "Georgia, serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: PARCHMENT,
              fontWeight: 400,
            }}
          >
            {book.title}
          </h1>

          {/* Author */}
          <p
            className="text-sm italic"
            style={{ ...fadeIn(260), color: "rgba(245,240,232,0.45)" }}
          >
            by{" "}
            <span style={{ color: "rgba(245,240,232,0.7)" }}>
              {book.author_name || "Unknown Author"}
            </span>
          </p>
        </div>
      </section>

      {/* ══════════ MAIN CONTENT ══════════ */}
      <section className="max-w-5xl mx-auto px-8 py-16">
        <div className="flex flex-col md:flex-row gap-12">
          {/* ── Book Cover ── */}
          <div className="w-full md:w-[340px] shrink-0" style={fadeIn(300)}>
            <div
              className="relative overflow-hidden"
              style={{ aspectRatio: "2/3" }}
            >
              {/* Spine */}
              <div
                className="absolute left-0 top-0 bottom-0 w-[12px] z-10"
                style={{ background: spineCol }}
              />

              {/* Cover image */}
              {book.book_img && !imgError && (
                <img
                  src={book.book_img}
                  alt={book.title}
                  className="absolute inset-0 ml-[12px] w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              )}

              {/* Placeholder / fallback cover */}
              <div
                className="absolute inset-0 ml-[12px] flex flex-col justify-between p-6"
                style={{
                  background: hasImage
                    ? "rgba(0,0,0,0)"
                    : `linear-gradient(135deg, ${spineCol.replace("0.7", "0.25")} 0%, ${ESPRESSO} 100%)`,
                  border: "1px solid rgba(212,175,95,0.15)",
                }}
              >
                {!hasImage && (
                  <>
                    {/* Line texture */}
                    <div
                      className="absolute inset-0 opacity-[0.04]"
                      style={{
                        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(212,175,95,1) 19px, rgba(212,175,95,1) 20px)`,
                      }}
                    />
                    {/* Stock badge */}
                    {lowStock && (
                      <div className="self-start relative z-10">
                        <span
                          className="text-[0.6rem] tracking-[0.2em] uppercase px-2 py-1"
                          style={{ background: GOLD, color: ESPRESSO }}
                        >
                          Low Stock
                        </span>
                      </div>
                    )}
                    {!inStock && (
                      <div className="self-start relative z-10">
                        <span
                          className="text-[0.6rem] tracking-[0.2em] uppercase px-2 py-1"
                          style={{ background: "#8b3a3a", color: PARCHMENT }}
                        >
                          Out of Stock
                        </span>
                      </div>
                    )}
                    {/* Title on cover */}
                    <div className="relative z-10">
                      <div
                        className="h-px w-8 mb-4"
                        style={{ background: GOLD, opacity: 0.5 }}
                      />
                      <p
                        className="text-lg leading-snug italic mb-2"
                        style={{
                          color: PARCHMENT,
                          fontFamily: "Georgia, serif",
                        }}
                      >
                        {book.title}
                      </p>
                      <p
                        className="text-[0.68rem] tracking-widest uppercase"
                        style={{ color: GOLD, opacity: 0.7 }}
                      >
                        {book.author_name || "Unknown Author"}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Shadow effect at bottom of cover */}
              <div
                className="absolute bottom-0 left-[12px] right-0 h-16 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.15) 0%, transparent 100%)",
                }}
              />
            </div>
          </div>

          {/* ── Book Details ── */}
          <div className="flex-1 min-w-0" style={fadeIn(380)}>
            {/* Category & Date bar */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span
                className="text-[0.62rem] tracking-[0.2em] uppercase px-3 py-1.5 border"
                style={{ color: BROWN_MID, borderColor: BORDER_TAN }}
              >
                {book.category_name || "Uncategorized"}
              </span>
              {book.published_date && (
                <span
                  className="text-[0.68rem] italic"
                  style={{ color: BROWN_MID }}
                >
                  Published{" "}
                  {new Date(book.published_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>

            {/* Title */}
            <h2
              className="text-3xl xl:text-4xl font-normal mb-2"
              style={{ color: ESPRESSO, fontFamily: "Georgia, serif" }}
            >
              {book.title}
            </h2>

            {/* Author */}
            <p
              className="text-sm tracking-widest uppercase mb-6"
              style={{ color: GOLD }}
            >
              {book.author_name || "Unknown Author"}
            </p>

            {/* Divider */}
            <div
              className="h-px w-full mb-6"
              style={{ background: BORDER_TAN, opacity: 0.5 }}
            />

            {/* Price & Stock row */}
            <div className="flex items-baseline gap-6 mb-6">
              <span
                className="text-3xl font-semibold"
                style={{ color: ESPRESSO, fontFamily: "Georgia, serif" }}
              >
                ${parseFloat(book.price).toFixed(2)}
              </span>
              {lowStock && (
                <span
                  className="text-[0.65rem] tracking-[0.18em] uppercase px-3 py-1"
                  style={{ background: `rgba(212,175,95,0.15)`, color: GOLD }}
                >
                  Only {book.stock} left
                </span>
              )}
              {!inStock && (
                <span
                  className="text-[0.65rem] tracking-[0.18em] uppercase px-3 py-1"
                  style={{
                    background: "rgba(139,58,58,0.08)",
                    color: "#8b3a3a",
                  }}
                >
                  Out of Stock
                </span>
              )}
              {inStock && !lowStock && (
                <span
                  className="text-[0.65rem] tracking-[0.18em] uppercase px-3 py-1"
                  style={{
                    background: "rgba(60,139,100,0.08)",
                    color: "#3c8b64",
                  }}
                >
                  In Stock
                </span>
              )}
            </div>

            {/* Description */}
            {book.description && (
              <div className="mb-8">
                <p
                  className="text-[0.68rem] tracking-[0.18em] uppercase mb-3"
                  style={{ color: BROWN_MID }}
                >
                  Description
                </p>
                <p
                  className="leading-relaxed text-[0.92rem]"
                  style={{
                    color: "#4a3f33",
                    fontFamily: "Georgia, serif",
                    lineHeight: 1.85,
                  }}
                >
                  {book.description}
                </p>
              </div>
            )}

            {/* Divider */}
            <div
              className="h-px w-full mb-8"
              style={{ background: BORDER_TAN, opacity: 0.5 }}
            />

            {/* Quantity + Add to Cart */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Quantity selector */}
              {inStock && (
                <div
                  className="flex items-center border"
                  style={{ borderColor: BORDER_TAN }}
                >
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-3 py-2.5 text-sm bg-transparent border-none cursor-pointer transition-colors duration-200"
                    style={{ color: ESPRESSO }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "rgba(26,18,9,0.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    −
                  </button>
                  <span
                    className="px-4 py-2.5 text-sm min-w-[44px] text-center"
                    style={{
                      color: ESPRESSO,
                      fontFamily: "Georgia, serif",
                      borderLeft: `1px solid ${BORDER_TAN}`,
                      borderRight: `1px solid ${BORDER_TAN}`,
                    }}
                  >
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => Math.min(book.stock, q + 1))}
                    className="px-3 py-2.5 text-sm bg-transparent border-none cursor-pointer transition-colors duration-200"
                    style={{ color: ESPRESSO }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "rgba(26,18,9,0.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    +
                  </button>
                </div>
              )}

              {/* Add to cart */}
              <button
                disabled={!inStock}
                onClick={() => {
                  addToCart(book, qty);
                }}
                className="px-8 py-3 text-xs tracking-[0.25em] uppercase border-none cursor-pointer transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed relative"
                style={{ background: ESPRESSO, color: PARCHMENT }}
                onMouseEnter={(e) => {
                  if (inStock) {
                    e.currentTarget.style.background = GOLD;
                    e.currentTarget.style.color = ESPRESSO;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = ESPRESSO;
                  e.currentTarget.style.color = PARCHMENT;
                }}
              >
                {inStock ? "Add to Cart" : "Out of Stock"}
              </button>

              {/* Continue browsing */}
              <button
                onClick={() => navigate("/browse")}
                className="px-6 py-3 text-xs tracking-[0.18em] uppercase border cursor-pointer bg-transparent transition-all duration-300"
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
                Continue Browsing
              </button>
            </div>

            {/* Book meta details */}
            <div className="mt-10 pt-8">
              <p
                className="text-[0.62rem] tracking-[0.2em] uppercase mb-4"
                style={{ color: BROWN_MID }}
              >
                Book Details
              </p>
              <div className="grid grid-cols-2 gap-y-3 gap-x-8 max-w-md">
                {[
                  { label: "Author", value: book.author_name || "Unknown" },
                  {
                    label: "Category",
                    value: book.category_name || "Uncategorized",
                  },
                  {
                    label: "Published",
                    value: book.published_date
                      ? new Date(book.published_date).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "short", day: "numeric" },
                        )
                      : "N/A",
                  },
                  { label: "Stock", value: `${book.stock} available` },
                ].map((item) => (
                  <div key={item.label}>
                    <p
                      className="text-[0.62rem] tracking-[0.15em] uppercase mb-0.5"
                      style={{ color: BORDER_TAN }}
                    >
                      {item.label}
                    </p>
                    <p
                      className="text-sm"
                      style={{
                        color: ESPRESSO,
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ RELATED BOOKS CAROUSEL ══ */}
      {relatedBooks.length > 0 && (
        <section className="py-20 px-8" style={{ background: "#ede8de" }}>
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <h2
                className="text-2xl md:text-3xl font-normal"
                style={{ color: ESPRESSO, fontFamily: "Georgia, serif" }}
              >
                More from <em style={{ color: GOLD }}>{book.category_name}</em>
              </h2>
              <p
                className="text-sm mt-2"
                style={{ color: BROWN_MID, fontStyle: "italic" }}
              >
                Explore other books in this category
              </p>
            </div>

            {!loadingRelated && (
              <Carousel
                items={relatedBooks}
                renderItem={(b) => (
                  <div
                    className="group cursor-pointer"
                    onClick={() => navigate(`/book/${b.id}`)}
                    style={{ height: "100%" }}
                  >
                    <div
                      className="relative overflow-hidden rounded mb-4"
                      style={{ aspectRatio: "2/3" }}
                    >
                      {b.book_img ? (
                        <img
                          src={b.book_img}
                          alt={b.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-4xl"
                          style={{
                            background: `linear-gradient(135deg, ${
                              SPINE_COLORS[(b.id || 0) % SPINE_COLORS.length]
                            }, ${SPINE_COLORS[(b.id || 1) % SPINE_COLORS.length]})`,
                          }}
                        >
                          📖
                        </div>
                      )}
                    </div>
                    <h3
                      className="text-sm font-semibold line-clamp-1 mb-2"
                      style={{ color: ESPRESSO }}
                    >
                      {b.title}
                    </h3>
                    <p className="text-xs mb-2" style={{ color: BROWN_MID }}>
                      {b.author}
                    </p>
                    <p className="text-sm font-bold" style={{ color: GOLD }}>
                      ${parseFloat(b.price).toFixed(2)}
                    </p>
                  </div>
                )}
                itemsPerView={6}
              />
            )}

            {loadingRelated && (
              <div className="text-center py-8">
                <p style={{ color: BROWN_MID }}>Loading related books...</p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
