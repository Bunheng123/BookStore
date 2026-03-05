import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

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

export default function BookCard({ book, index }) {
  const navigate = useNavigate();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);

  const spineCol = SPINE_COLORS[index % SPINE_COLORS.length];

  return (
    <div
      ref={ref}
      onClick={() => navigate(`/books/${book.id}`)}
      className="group cursor-pointer"
      style={{
        transition: `opacity 0.6s ease ${index * 50}ms, transform 0.6s ease ${index * 50}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
      }}
    >
      {/* Book cover */}
      <div
        className="relative mb-4 overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-300"
        style={{ aspectRatio: "2/3" }}
      >
        {/* Spine */}
        <div
          className="absolute left-0 top-0 bottom-0 w-2.5 z-10"
          style={{ background: spineCol }}
        />

        {/* Cover — use book_img if available */}
        {book.book_img ? (
          <img
            src={book.book_img}
            alt={book.title}
            className="absolute inset-0 ml-2.5 w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : null}

        {/* Overlay / placeholder cover */}
        <div
          className="absolute inset-0 ml-2.5 flex flex-col justify-between p-4"
          style={{
            background: book.book_img
              ? "rgba(0,0,0,0)"
              : `linear-gradient(135deg, ${spineCol.replace("0.7", "0.25")} 0%, ${ESPRESSO} 100%)`,
            border: "1px solid rgba(212,175,95,0.15)",
          }}
        >
          {!book.book_img && (
            <>
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(212,175,95,1) 19px, rgba(212,175,95,1) 20px)`,
                }}
              />
              {/* Stock badge */}
              {book.stock <= 5 && book.stock > 0 && (
                <div className="self-start relative z-10">
                  <span
                    className="text-[0.55rem] tracking-[0.2em] uppercase px-2 py-1"
                    style={{ background: GOLD, color: ESPRESSO }}
                  >
                    Low Stock
                  </span>
                </div>
              )}
              {book.stock === 0 && (
                <div className="self-start relative z-10">
                  <span
                    className="text-[0.55rem] tracking-[0.2em] uppercase px-2 py-1"
                    style={{ background: "#8b3a3a", color: PARCHMENT }}
                  >
                    Out of Stock
                  </span>
                </div>
              )}
              <div className="relative z-10">
                <div
                  className="h-px w-6 mb-3"
                  style={{ background: GOLD, opacity: 0.5 }}
                />
                <p
                  className="text-[#f5f0e8] text-sm leading-snug italic mb-1"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {book.title}
                </p>
                <p
                  className="text-[0.62rem] tracking-widest uppercase"
                  style={{ color: GOLD, opacity: 0.7 }}
                >
                  {book.author_name || "Unknown Author"}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Hover overlay */}
        <div
          className="absolute inset-0 ml-2.5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: "rgba(26,18,9,0.85)" }}
        >
          <span
            className="text-[0.65rem] tracking-[0.25em] uppercase px-4 py-2"
            style={{ color: GOLD }}
          >
            View Book
          </span>
        </div>
      </div>

      {/* Info */}
      <div>
        <p
          className="text-sm leading-snug mb-1 group-hover:text-[#d4af5f] transition-colors duration-200"
          style={{
            color: ESPRESSO,
            fontFamily: "Georgia, serif",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {book.title}
        </p>
        <p
          className="text-[0.72rem] mb-2"
          style={{
            color: BROWN_MID,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {book.author_name || "Unknown Author"}
        </p>
        <div className="flex items-center justify-between">
          <span
            className="text-sm font-semibold"
            style={{ color: ESPRESSO, fontFamily: "Georgia, serif" }}
          >
            ${parseFloat(book.price).toFixed(2)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(book, 1);
            }}
            disabled={book.stock === 0}
            className="text-[0.6rem] tracking-[0.18em] uppercase px-3 py-1.5 transition-all duration-300 cursor-pointer bg-transparent disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ color: ESPRESSO }}
            onMouseEnter={(e) => {
              if (book.stock > 0) {
                e.currentTarget.style.background = ESPRESSO;
                e.currentTarget.style.color = PARCHMENT;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = ESPRESSO;
            }}
          >
            {book.stock === 0 ? "Sold Out" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
