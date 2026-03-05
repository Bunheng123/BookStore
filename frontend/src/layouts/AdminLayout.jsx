import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState } from "react";
import ProfileModal from "../components/ProfileModal";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/admin/dashboard", icon: "▦" },
  { label: "Books", path: "/admin/books", icon: "📚" },
  { label: "Orders", path: "/admin/orders", icon: "📦" },
  { label: "Staff", path: "/admin/staff", icon: "👔" },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);

  const user = (() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  })();

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-[#f5f0e8]">
      {/* ── Sidebar ── */}
      <aside className="w-56 bg-[#1a1209] flex flex-col h-screen sticky top-0 shrink-0">
        {/* Logo */}
        <div className="px-6 py-7 border-b border-white/10 shrink-0">
          <p className="text-[#d4af5f] text-[0.6rem] tracking-[0.35em] uppercase mb-1">
            Folio & Ink
          </p>
          <p
            className="text-[#f5f0e8] text-sm italic"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Staff Panel
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded text-sm transition-colors duration-200 ${
                  active
                    ? "bg-[#d4af5f] text-[#1a1209] font-semibold"
                    : "text-[#f5f0e8]/60 hover:text-[#f5f0e8] hover:bg-white/5"
                }`}
              >
                <span>{item.icon}</span>
                <span className="tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/10 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#f5f0e8]/50 hover:text-[#f5f0e8] hover:bg-white/5 rounded transition-colors duration-200 cursor-pointer bg-transparent border-none"
          >
            <span>⎋</span>
            <span className="tracking-wide">Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header / Breadcrumb */}
        <header className="h-16 bg-white border-b border-[#e5ddd0] flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[0.6rem] tracking-[0.2em] uppercase text-[#d4af5f]">
              Admin
            </span>
            <span className="text-[#8a7560]">/</span>
            <h2 className="text-sm font-semibold tracking-wide text-[#1a1209]">
              {NAV_ITEMS.find((n) => n.path === location.pathname)?.label ||
                "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-8 h-8 rounded-full bg-[#f5f0e8] flex items-center justify-center text-xs border border-[#c8b99a] hover:border-[#d4af5f] transition-colors duration-200">
              🔔
            </button>
            <div className="h-8 w-px bg-[#e5ddd0]" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold text-[#1a1209] leading-none">
                  {user.first_name || "Admin"} User
                </p>
                <p className="text-[9px] text-[#8a7560] uppercase tracking-tighter">
                  Super Admin
                </p>
              </div>
              <button
                onClick={() => setShowProfile(true)}
                className="w-8 h-8 rounded-full bg-[#d4af5f] flex items-center justify-center text-[#1a1209] font-bold text-xs ring-2 ring-[#f5f0e8] hover:ring-[#d4af5f] transition-all duration-200 cursor-pointer border-none"
                title="View Profile"
              >
                {(user.first_name?.[0] || "A").toUpperCase()}
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable area */}
        <div className="flex-1 overflow-y-auto bg-[#fdfaf5]">{children}</div>
      </main>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        user={user}
        role="admin"
      />
    </div>
  );
}
