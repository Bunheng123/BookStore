import { useState, useRef } from "react";

const PARCHMENT = "#f5f0e8";
const ESPRESSO = "#1a1209";
const GOLD = "#d4af5f";
const BROWN_MID = "#8a7560";

export default function Carousel({
  items,
  renderItem,
  title,
  itemsPerView = 6,
}) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef(null);

  const scroll = (direction) => {
    if (!containerRef.current) return;

    const scrollAmount = 300;
    const newPosition =
      direction === "left"
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;

    containerRef.current.scrollLeft = newPosition;
    setScrollPosition(newPosition);
  };

  const itemWidth = 100 / itemsPerView;

  return (
    <div className="relative group">
      {/* Title */}
      {title && (
        <div className="mb-6">
          <h3
            className="text-2xl md:text-3xl font-normal"
            style={{ color: ESPRESSO, fontFamily: "Georgia, serif" }}
          >
            {title}
          </h3>
        </div>
      )}

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 hover:bg-opacity-90"
          style={{
            background: GOLD,
            color: ESPRESSO,
            width: "44px",
            height: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px",
          }}
          aria-label="Scroll left"
        >
          ‹
        </button>

        {/* Items Container */}
        <div
          ref={containerRef}
          className="flex gap-6 overflow-x-hidden scroll-smooth"
          style={{
            scrollBehavior: "smooth",
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{
                width: `calc(${itemWidth}% - ${(6 - 1) / itemsPerView}rem)`,
              }}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 hover:bg-opacity-90"
          style={{
            background: GOLD,
            color: ESPRESSO,
            width: "44px",
            height: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px",
          }}
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>

      {/* Info Text */}
      <div className="mt-4 text-xs italic" style={{ color: BROWN_MID }}>
        <p>💡 Scroll or click arrows to browse items</p>
      </div>
    </div>
  );
}
