import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { getApiUrl } from "../../apiConfig";

const ESPRESSO = "#1a1209";
const GOLD = "#d4af5f";
const PARCHMENT = "#f5f0e8";
const BORDER_TAN = "#c8b99a";
const BROWN_MID = "#8a7560";

export default function Checkout() {
  const { cart, totalPrice, addNotification, clearCart } = useCart();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [processing, setProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/cart");
      return;
    }

    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("auth_token");

    if (token && user.id) {
      setIsLoggedIn(true);
      setCustomerId(user.id);
      setUserEmail(user.email || "");
    }
  }, [cart, navigate]);

  const handleCompletePayment = async () => {
    const currentCustId = customerId;
    const currentEmail = isLoggedIn ? userEmail : guestEmail;

    if (!currentEmail) {
      addNotification("Please enter your email address", "error");
      return;
    }

    if (!currentCustId) {
      addNotification("Please log in to complete your order", "error");
      return;
    }

    setProcessing(true);

    try {
      // Prepare order data
      const orderData = {
        customer_id: currentCustId,
        total_amount: totalPrice,
        items: cart.map((item) => ({
          book_id: item.id,
          quantity: item.quantity,
          price: parseFloat(item.price),
        })),
      };

      // Send order to backend
      const response = await fetch(getApiUrl("api/orders"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        setOrderPlaced(true);
        clearCart();

        setTimeout(() => {
          addNotification("Order placed successfully!", "success");
          navigate("/");
        }, 2000);
      } else {
        addNotification(result.message || "Payment failed", "error");
      }
    } catch (error) {
      addNotification(`Payment error: ${error.message}`, "error");
    } finally {
      setProcessing(false);
    }
  };

  if (orderPlaced) {
    return (
      <div
        style={{ background: PARCHMENT, minHeight: "100vh" }}
        className="pt-32 pb-20 flex items-center justify-center"
      >
        <div className="max-w-md mx-auto p-12 text-center">
          <div className="mb-8">
            <div className="text-6xl mb-4" style={{ color: GOLD }}>
              ✓
            </div>
            <h1
              className="text-4xl font-normal mb-4"
              style={{ color: ESPRESSO, fontFamily: "Georgia, serif" }}
            >
              Order Confirmed
            </h1>
            <p
              className="text-lg italic"
              style={{ color: BROWN_MID, fontFamily: "Georgia, serif" }}
            >
              Thank you for your purchase!
            </p>
            <p className="text-sm mt-4" style={{ color: BORDER_TAN }}>
              Your order has been placed successfully. You will receive a
              confirmation email shortly.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ background: PARCHMENT, minHeight: "100vh" }}
      className="pt-32 pb-20"
    >
      <div className="max-w-4xl mx-auto px-8">
        {/* Header */}
        <header className="mb-12">
          <p
            className="text-[0.62rem] tracking-[0.35em] uppercase mb-3"
            style={{ color: GOLD }}
          >
            Secure Checkout
          </p>
          <h1
            className="text-4xl md:text-5xl font-normal"
            style={{ color: ESPRESSO, fontFamily: "Georgia, serif" }}
          >
            Complete Your Order
          </h1>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Order Summary */}
          <div className="flex-1">
            <div
              className="p-8 border"
              style={{ borderColor: BORDER_TAN, background: "white" }}
            >
              <p
                className="text-[0.65rem] tracking-[0.2em] uppercase mb-6 font-bold"
                style={{ color: GOLD }}
              >
                Order Summary
              </p>

              <div
                className="space-y-4 mb-8 pb-8"
                style={{ borderBottom: `1px solid ${BORDER_TAN}40` }}
              >
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <p className="font-medium" style={{ color: ESPRESSO }}>
                        {item.title}
                      </p>
                      <p className="text-sm" style={{ color: BROWN_MID }}>
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span
                      className="font-medium text-right"
                      style={{ color: ESPRESSO }}
                    >
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span style={{ color: BROWN_MID }}>Subtotal</span>
                  <span style={{ color: ESPRESSO }}>
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: BROWN_MID }}>Shipping</span>
                  <span style={{ color: ESPRESSO }}>Complimentary</span>
                </div>
                <div
                  className="h-px w-full"
                  style={{ background: `${BORDER_TAN}40` }}
                />
                <div className="flex justify-between text-lg">
                  <span
                    style={{ color: ESPRESSO, fontFamily: "Georgia, serif" }}
                  >
                    Total
                  </span>
                  <span
                    style={{
                      color: GOLD,
                      fontFamily: "Georgia, serif",
                      fontSize: "1.25rem",
                    }}
                  >
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Billing Section */}
          <div className="lg:w-96">
            <div
              className="p-8"
              style={{ background: ESPRESSO, color: PARCHMENT }}
            >
              {!isLoggedIn && (
                <div
                  className="mb-8 pb-8"
                  style={{ borderBottom: `1px solid rgba(245,240,232,0.1)` }}
                >
                  <p
                    className="text-[0.65rem] tracking-[0.2em] uppercase mb-4 font-bold"
                    style={{ color: GOLD }}
                  >
                    Guest Checkout
                  </p>
                  <p className="text-sm italic mb-4">
                    Already have an account?
                  </p>
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full py-2 px-4 mb-4 text-xs tracking-[0.2em] uppercase border"
                    style={{
                      borderColor: GOLD,
                      background: "transparent",
                      color: GOLD,
                    }}
                  >
                    Sign In
                  </button>
                  <p className="text-[0.65rem] opacity-40">
                    Continue as guest using your email below
                  </p>
                </div>
              )}

              <p
                className="text-[0.65rem] tracking-[0.2em] uppercase mb-6 font-bold"
                style={{ color: GOLD }}
              >
                Billing Information
              </p>

              {/* Email Input */}
              <div className="mb-6">
                <label
                  className="block text-[0.7rem] tracking-[0.2em] uppercase mb-3"
                  style={{ color: GOLD }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={isLoggedIn ? userEmail : guestEmail}
                  onChange={(e) => {
                    if (isLoggedIn) {
                      setUserEmail(e.target.value);
                    } else {
                      setGuestEmail(e.target.value);
                    }
                  }}
                  placeholder="your@email.com"
                  className="w-full px-0 py-2 bg-transparent border-b text-base outline-none"
                  style={{
                    borderColor: "rgba(245,240,232,0.3)",
                    color: PARCHMENT,
                  }}
                />
                {isLoggedIn && (
                  <p className="text-[0.65rem] mt-2 opacity-60">
                    ✓ Account email verified
                  </p>
                )}
                {!isLoggedIn && (
                  <p className="text-[0.65rem] mt-2 opacity-60">
                    We'll send your receipt to this email
                  </p>
                )}
              </div>

              {/* Card Section (mock) */}
              <div className="mb-8">
                <p
                  className="text-[0.65rem] tracking-[0.2em] uppercase mb-3 font-bold"
                  style={{ color: GOLD }}
                >
                  Card Information
                </p>
                <div
                  className="p-4 border"
                  style={{
                    borderColor: "rgba(245,240,232,0.2)",
                    background: "rgba(0,0,0,0.2)",
                  }}
                >
                  <p className="text-xs opacity-60">•••• •••• •••• 4242</p>
                  <p className="text-xs mt-2 opacity-60">Visa • Exp 12/25</p>
                </div>
              </div>

              {/* Security Notice */}
              <div
                className="mb-8 pb-8"
                style={{ borderBottom: "1px solid rgba(245,240,232,0.1)" }}
              >
                <p className="text-[0.65rem] opacity-40">
                  🔒 Your payment is secure and encrypted with SSL. We never
                  store your full card details.
                </p>
              </div>

              {/* Action Buttons */}
              <button
                onClick={handleCompletePayment}
                disabled={
                  processing ||
                  !customerId ||
                  !(isLoggedIn ? userEmail : guestEmail)
                }
                className="w-full py-3 mb-4 text-xs tracking-[0.2em] uppercase border-none cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: GOLD,
                  color: ESPRESSO,
                  fontWeight: 600,
                }}
                onMouseEnter={(e) => {
                  if (!processing && customerId) {
                    e.currentTarget.style.transform = "scale(1.02)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                {processing
                  ? "Processing..."
                  : customerId
                    ? "Complete Purchase"
                    : "Sign In to Purchase"}
              </button>

              <button
                onClick={() => navigate("/cart")}
                disabled={processing}
                className="w-full py-3 text-xs tracking-[0.2em] uppercase border cursor-pointer transition-all duration-300"
                style={{
                  borderColor: "rgba(245,240,232,0.3)",
                  background: "transparent",
                  color: PARCHMENT,
                }}
              >
                Return to Cart
              </button>

              <p className="text-[0.65rem] text-center mt-6 opacity-40">
                Your order will be processed immediately. Thank you for shopping
                with Folio & Ink.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
