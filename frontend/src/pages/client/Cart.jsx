import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const ESPRESSO = "#1a1209";
const GOLD = "#d4af5f";
const PARCHMENT = "#f5f0e8";
const BORDER_TAN = "#c8b99a";
const BROWN_MID = "#8a7560";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } =
    useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.length === 0) {
      return;
    }
    navigate("/checkout");
  };

  return (
    <div
      style={{ background: PARCHMENT, minHeight: "80vh" }}
      className="pt-32 pb-20"
    >
      <div className="max-w-5xl mx-auto px-8">
        <header className="mb-12">
          <p
            className="text-[0.62rem] tracking-[0.35em] uppercase mb-3"
            style={{ color: GOLD }}
          >
            Your Selection
          </p>
          <h1
            className="text-4xl md:text-5xl font-normal"
            style={{ color: ESPRESSO, fontFamily: "Georgia, serif" }}
          >
            The Reading List
          </h1>
        </header>

        {cart.length === 0 ? (
          <div
            className="py-24 text-center border-t border-b"
            style={{ borderColor: `${BORDER_TAN}40` }}
          >
            <p
              className="text-lg italic mb-8"
              style={{ color: BROWN_MID, fontFamily: "Georgia, serif" }}
            >
              "A room without books is like a body without a soul."
            </p>
            <p
              className="text-sm tracking-widest uppercase mb-10"
              style={{ color: BORDER_TAN }}
            >
              Your library is currently empty.
            </p>
            <button
              onClick={() => navigate("/browse")}
              className="px-10 py-4 text-xs tracking-[0.25em] uppercase transition-all duration-300 cursor-pointer"
              style={{ background: ESPRESSO, color: PARCHMENT }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = GOLD;
                e.currentTarget.style.color = ESPRESSO;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = ESPRESSO;
                e.currentTarget.style.color = PARCHMENT;
              }}
            >
              Start Browsing
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="flex-1">
              <div className="space-y-8">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-6 pb-8 border-b"
                    style={{ borderColor: `${BORDER_TAN}30` }}
                  >
                    <div
                      className="w-24 h-36 shrink-0 bg-[#e5ddd0] relative overflow-hidden cursor-pointer shadow-md"
                      onClick={() => navigate(`/books/${item.id}`)}
                    >
                      {item.book_img ? (
                        <img
                          src={item.book_img}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center p-2 text-center text-[0.6rem] uppercase tracking-tighter"
                          style={{ color: BROWN_MID }}
                        >
                          {item.title}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h3
                            className="text-xl font-normal cursor-pointer hover:opacity-70 transition-opacity"
                            style={{
                              color: ESPRESSO,
                              fontFamily: "Georgia, serif",
                            }}
                            onClick={() => navigate(`/books/${item.id}`)}
                          >
                            {item.title}
                          </h3>
                          <span
                            className="text-lg"
                            style={{
                              color: ESPRESSO,
                              fontFamily: "Georgia, serif",
                            }}
                          >
                            $
                            {(parseFloat(item.price) * item.quantity).toFixed(
                              2,
                            )}
                          </span>
                        </div>
                        <p
                          className="text-xs tracking-widest uppercase mb-4"
                          style={{ color: GOLD }}
                        >
                          {item.author_name}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        <div
                          className="flex items-center border"
                          style={{ borderColor: BORDER_TAN }}
                        >
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="px-3 py-1.5 text-sm bg-transparent border-none cursor-pointer"
                            style={{ color: ESPRESSO }}
                          >
                            −
                          </button>
                          <span
                            className="px-4 py-1.5 text-sm min-w-[32px] text-center border-l border-r"
                            style={{
                              borderColor: BORDER_TAN,
                              fontFamily: "Georgia, serif",
                            }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="px-3 py-1.5 text-sm bg-transparent border-none cursor-pointer"
                            style={{ color: ESPRESSO }}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[0.65rem] tracking-[0.15em] uppercase border-none bg-transparent cursor-pointer underline underline-offset-4 opacity-50 hover:opacity-100 transition-opacity"
                          style={{ color: ESPRESSO }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-80 shrink-0">
              <div
                className="p-8 sticky top-32"
                style={{ background: ESPRESSO, color: PARCHMENT }}
              >
                <p
                  className="text-[0.6rem] tracking-[0.3em] uppercase mb-6"
                  style={{ color: GOLD }}
                >
                  Order Summary
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "rgba(245,240,232,0.5)" }}>
                      Items ({totalItems})
                    </span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "rgba(245,240,232,0.5)" }}>
                      Shipping
                    </span>
                    <span className="italic">Complimentary</span>
                  </div>
                  <div
                    className="h-px w-full"
                    style={{ background: "rgba(245,240,232,0.1)" }}
                  />
                  <div className="flex justify-between text-lg">
                    <span style={{ fontFamily: "Georgia, serif" }}>Total</span>
                    <span style={{ fontFamily: "Georgia, serif", color: GOLD }}>
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-4 text-xs tracking-[0.25em] uppercase border-none cursor-pointer mb-4 transition-all duration-300 hover:opacity-90"
                  style={{ background: GOLD, color: ESPRESSO }}
                >
                  Proceed to Checkout
                </button>
                <p className="text-[0.6rem] text-center italic opacity-40">
                  Premium service by Folio & Ink
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
