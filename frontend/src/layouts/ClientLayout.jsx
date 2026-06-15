import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ProfileModal from "../components/ProfileModal";

const ESPRESSO = "#1a1209";
const GOLD = "#d4af5f";
const PARCHMENT = "#f5f0e8";

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar({ showProfile, setShowProfile }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const token = localStorage.getItem("auth_token");
  const userName = localStorage.getItem("user_name");
  const isHome = location.pathname === "/";
  const { totalItems } = useCart();

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_name");
    navigate("/login");
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 px-8 transition-all duration-500"
      style={{
        background: scrolled ? ESPRESSO : "transparent",
        boxShadow: scrolled ? "0 1px 0 rgba(212,175,95,0.15)" : "none",
        paddingTop: scrolled ? "1rem" : "1.5rem",
        paddingBottom: scrolled ? "1rem" : "1.5rem",
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="cursor-pointer" onClick={() => navigate("/")}>
          <p
            className="text-[0.6rem] tracking-[0.35em] uppercase"
            style={{ color: GOLD }}
          >
            Folio & Ink
          </p>
          <p
            className="text-lg italic leading-tight"
            style={{ color: PARCHMENT, fontFamily: "Georgia, serif" }}
          >
            Bookstore
          </p>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {["Home", "Browse", "About Us", "Contact", "Cart"].map((item) => {
            const path =
              item === "Home"
                ? "/"
                : item === "About Us"
                  ? "/about"
                  : item === "Contact"
                    ? "/contact"
                    : `/${item.toLowerCase()}`;
            const active = location.pathname === path;
            return (
              <button
                key={item}
                onClick={() => navigate(path)}
                className="relative text-xs tracking-[0.18em] uppercase transition-colors duration-200 cursor-pointer bg-transparent border-none flex items-center gap-1.5"
                style={{ color: active ? GOLD : "rgba(245,240,232,0.55)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = active
                    ? GOLD
                    : "rgba(245,240,232,0.55)")
                }
              >
                {item}
                {item === "Cart" && totalItems > 0 && (
                  <span
                    className="flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold"
                    style={{ background: GOLD, color: ESPRESSO }}
                  >
                    {totalItems}
                  </span>
                )}
                {active && (
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-px"
                    style={{ background: GOLD, opacity: 0.5 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-4">
          {token ? (
            <>
              <button
                onClick={() => setShowProfile(true)}
                className="text-xs tracking-[0.18em] uppercase transition-colors duration-200 cursor-pointer bg-transparent border-none hover:text-[#d4af5f]"
                style={{ color: "rgba(245,240,232,0.55)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(245,240,232,0.55)")
                }
              >
                {userName ? `👤 ${userName}` : "👤 Profile"}
              </button>
              <button
                onClick={handleLogout}
                className="text-xs tracking-[0.18em] uppercase transition-colors duration-200 cursor-pointer bg-transparent border-none"
                style={{ color: "rgba(245,240,232,0.55)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(245,240,232,0.55)")
                }
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="text-xs tracking-[0.18em] uppercase px-4 py-2 border transition-all duration-300 cursor-pointer bg-transparent"
              style={{ color: GOLD, borderColor: GOLD }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = GOLD;
                e.currentTarget.style.color = ESPRESSO;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = GOLD;
              }}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

// ── Toast Notification ────────────────────────────────────────────────────────
function Toast({ message }) {
  return (
    <div
      className="mb-3 px-6 py-4 shadow-2xl flex items-center gap-3 animate-slide-in pointer-events-auto"
      style={{
        background: "#1a1209", // ESPRESSO
        border: "1px solid #d4af5f", // GOLD
        minWidth: "300px",
      }}
    >
      <div
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: "#d4af5f" }}
      />
      <p
        className="text-[0.65rem] tracking-[0.2em] uppercase"
        style={{ color: "#f5f0e8" }} // PARCHMENT
      >
        {message}
      </p>
    </div>
  );
}

function ToastContainer() {
  const { notifications } = useCart();
  return (
    <div className="fixed bottom-8 right-8 z-100 flex flex-col items-end pointer-events-none">
      {notifications.map((n) => (
        <Toast key={n.id} {...n} />
      ))}
    </div>
  );
}

// ── Client Layout ─────────────────────────────────────────────────────────────
export default function ClientLayout({ children }) {
  const [showProfile, setShowProfile] = useState(false);

  const user = (() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  })();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: PARCHMENT }}
    >
      <Navbar showProfile={showProfile} setShowProfile={setShowProfile} />
      <ToastContainer />

      <main className="flex-1">{children}</main>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        user={user}
        role="customer"
      />

      {/* Footer */}
      <footer style={{ background: ESPRESSO }}>
        {/* Main Footer Content */}
        <div className="max-w-6xl mx-auto px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div>
              <p
                className="text-[0.6rem] tracking-[0.35em] uppercase mb-2"
                style={{ color: GOLD }}
              >
                Folio & Ink
              </p>
              <p
                className="text-lg italic mb-4"
                style={{ color: PARCHMENT, fontFamily: "Georgia, serif" }}
              >
                Bookstore
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "rgba(245,240,232,0.6)" }}
              >
                Discover your next favorite book from our curated collection of
                timeless classics and contemporary bestsellers.
              </p>
              {/* Social Links */}
              <div className="flex gap-4 mt-6">
                {[
                  { icon: "f", label: "Facebook" },
                  { icon: "𝕏", label: "Twitter" },
                  { icon: "in", label: "Instagram" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href="#"
                    className="w-8 h-8 flex items-center justify-center rounded border transition-all duration-300 text-xs font-bold"
                    style={{
                      borderColor: GOLD,
                      color: "rgba(245,240,232,0.6)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = GOLD;
                      e.currentTarget.style.color = ESPRESSO;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "rgba(245,240,232,0.6)";
                    }}
                    title={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <p
                className="text-xs tracking-[0.2em] uppercase font-semibold mb-6"
                style={{ color: GOLD }}
              >
                Quick Links
              </p>
              <ul className="space-y-3">
                {[
                  { label: "Home", path: "/" },
                  { label: "Browse Books", path: "/browse" },
                  { label: "About Us", path: "/about" },
                  { label: "Contact", path: "/contact" },
                ].map((link) => (
                  <li key={link.path}>
                    <button
                      onClick={() => navigate(link.path)}
                      className="text-xs transition-colors duration-200 cursor-pointer bg-transparent border-none p-0"
                      style={{ color: "rgba(245,240,232,0.6)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "rgba(245,240,232,0.6)")
                      }
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <p
                className="text-xs tracking-[0.2em] uppercase font-semibold mb-6"
                style={{ color: GOLD }}
              >
                Customer Service
              </p>
              <ul className="space-y-3">
                {[
                  "Shipping Info",
                  "Returns & Exchanges",
                  "FAQ",
                  "Privacy Policy",
                  "Terms & Conditions",
                ].map((item) => (
                  <li key={item}>
                    <button
                      className="text-xs transition-colors duration-200 cursor-pointer bg-transparent border-none p-0"
                      style={{ color: "rgba(245,240,232,0.6)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "rgba(245,240,232,0.6)")
                      }
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <p
                className="text-xs tracking-[0.2em] uppercase font-semibold mb-6"
                style={{ color: GOLD }}
              >
                Get in Touch
              </p>
              <div
                className="space-y-4 text-xs"
                style={{ color: "rgba(245,240,232,0.6)" }}
              >
                <div>
                  <p className="font-semibold mb-1" style={{ color: GOLD }}>
                    Email
                  </p>
                  <a
                    href="mailto:info@folioink.com"
                    className="transition-colors duration-200 no-underline"
                    style={{ color: "rgba(245,240,232,0.6)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "rgba(245,240,232,0.6)")
                    }
                  >
                    info@folioink.com
                  </a>
                </div>
                <div>
                  <p className="font-semibold mb-1" style={{ color: GOLD }}>
                    Phone
                  </p>
                  <a
                    href="tel:+1234567890"
                    className="transition-colors duration-200 no-underline"
                    style={{ color: "rgba(245,240,232,0.6)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "rgba(245,240,232,0.6)")
                    }
                  >
                    +1 (234) 567-890
                  </a>
                </div>
                <div>
                  <p className="font-semibold mb-1" style={{ color: GOLD }}>
                    Address
                  </p>
                  <p>
                    123 Book Street
                    <br />
                    Literary City, LC 12345
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div
            className="h-px mb-6"
            style={{ background: "rgba(212,175,95,0.15)" }}
          />

          {/* Newsletter */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p
                className="text-sm font-semibold mb-2"
                style={{ color: PARCHMENT }}
              >
                Subscribe to Our Newsletter
              </p>
              <p className="text-xs" style={{ color: "rgba(245,240,232,0.5)" }}>
                Get book recommendations and exclusive offers delivered to your
                inbox
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 text-sm bg-white/10 border outline-none flex-1 md:flex-none"
                style={{
                  borderColor: GOLD,
                  color: PARCHMENT,
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.boxShadow = `0 0 0 1px ${GOLD}`)
                }
                onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
              />
              <button
                className="px-6 py-2 text-xs font-semibold tracking-[0.1em] uppercase transition-all duration-300 cursor-pointer border-none"
                style={{
                  background: GOLD,
                  color: ESPRESSO,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = GOLD;
                  e.currentTarget.style.color = GOLD;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = GOLD;
                  e.currentTarget.style.color = ESPRESSO;
                }}
              >
                Subscribe
              </button>
            </div>
          </div>

          {/* Bottom Bar */}
          <div
            className="h-px mb-6"
            style={{ background: "rgba(212,175,95,0.15)" }}
          />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <p style={{ color: "rgba(245,240,232,0.4)" }}>
              © 2024 Folio & Ink Bookstore. All rights reserved.
            </p>
            <div
              className="flex gap-6"
              style={{ color: "rgba(245,240,232,0.4)" }}
            >
              <a
                href="#"
                className="no-underline transition-colors duration-200"
                style={{ color: "rgba(245,240,232,0.4)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(245,240,232,0.4)")
                }
              >
                Privacy
              </a>
              <a
                href="#"
                className="no-underline transition-colors duration-200"
                style={{ color: "rgba(245,240,232,0.4)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(245,240,232,0.4)")
                }
              >
                Terms
              </a>
              <a
                href="#"
                className="no-underline transition-colors duration-200"
                style={{ color: "rgba(245,240,232,0.4)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(245,240,232,0.4)")
                }
              >
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
