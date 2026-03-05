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
          {["Home", "Browse", "Cart"].map((item) => {
            const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
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
        <div
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(212,175,95,0.04) 39px, rgba(212,175,95,0.04) 40px)`,
          }}
        >
          <div className="max-w-6xl mx-auto px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p
                className="text-[0.6rem] tracking-[0.35em] uppercase mb-1"
                style={{ color: GOLD }}
              >
                Folio & Ink
              </p>
              <p
                className="text-lg italic"
                style={{ color: PARCHMENT, fontFamily: "Georgia, serif" }}
              >
                Bookstore
              </p>
            </div>

            <div className="flex gap-8">
              {[
                { label: "Home", path: "/" },
                { label: "Browse", path: "/browse" },
                { label: "Cart", path: "/cart" },
              ].map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  className="text-xs tracking-[0.15em] uppercase transition-colors duration-200 no-underline"
                  style={{ color: "rgba(245,240,232,0.35)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(245,240,232,0.35)")
                  }
                >
                  {item.label}
                </a>
              ))}
            </div>

            <p
              className="text-xs italic"
              style={{ color: "rgba(245,240,232,0.2)" }}
            >
              Est. 2024 · Folio & Ink Bookstore
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
