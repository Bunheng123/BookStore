import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, getApiUrl } from "../apiConfig";

const QUOTES = {
  login: {
    text: (
      <>
        A reader lives a thousand <span className="text-[#d4af5f]">lives</span>{" "}
        before he dies.
      </>
    ),
    author: "George R.R. Martin",
    sub: "Sign in and continue your journey.",
  },
  register: {
    text: (
      <>
        There is no <span className="text-[#d4af5f]">friend</span> as loyal as a
        book.
      </>
    ),
    author: "Ernest Hemingway",
    sub: "Join thousands of readers discovering their next favourite story.",
  },
};

const BookSpines = ({ count = 8 }) => (
  <div
    className="absolute top-10 flex gap-2 items-end"
    style={{ right: "3rem" }}
  >
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="w-3 rounded-sm transition-all duration-700"
        style={{
          height: `${[90, 60, 115, 75, 100, 55, 130, 80][i % 8]}px`,
          background: `rgba(212,175,95,${0.12 + i * 0.07})`,
          borderTop: "2px solid rgba(212,175,95,0.5)",
        }}
      />
    ))}
  </div>
);

function DecorativePanel({ mode, visible }) {
  const q = QUOTES[mode];
  return (
    <div className="flex flex-col justify-end h-full p-12 relative">
      <BookSpines />
      <div
        className={`relative z-10 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        <p className="text-[#d4af5f] tracking-[0.3em] uppercase text-xs mb-4">
          Folio & Ink Bookstore
        </p>
        <p
          className="text-[#f5f0e8] text-3xl xl:text-4xl leading-snug italic"
          style={{ fontFamily: "Georgia, serif" }}
        >
          "{q.text}"
        </p>
        <p className="mt-4 text-xs tracking-[0.2em] uppercase text-white/30">
          — {q.author}
        </p>
        <div className="flex items-center gap-3 mt-6">
          <div className="h-px w-8 bg-[#d4af5f] opacity-50" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#d4af5f] opacity-50" />
          <div className="h-px w-8 bg-[#d4af5f] opacity-50" />
        </div>
        <p className="mt-4 text-[#f5f0e8]/40 text-sm italic leading-relaxed max-w-xs">
          {q.sub}
        </p>
      </div>
    </div>
  );
}

function LoginForm({ onSwitch, mounted }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch(getApiUrl("api/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setSuccess("Welcome back, reader.");
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("user_role", data.role);
        localStorage.setItem(
          "user_name",
          data.user?.name ||
            `${data.user?.first_name} ${data.user?.last_name}` ||
            "",
        );
        // Redirect based on role
        setTimeout(() => {
          if (data.role === "admin") {
            navigate("/admin/dashboard");
          } else if (data.role === "customer") {
            navigate("/");
          } else {
            setError("Unknown role. Please contact support.");
          }
        }, 1200);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center h-full px-10 py-12">
      {/* Header */}
      <div
        className={`mb-8 transition-all duration-600 delay-100 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px flex-1 bg-[#d4af5f] opacity-40" />
          <span className="text-[#d4af5f] text-[0.65rem] tracking-[0.35em] uppercase">
            Folio & Ink
          </span>
          <div className="h-px flex-1 bg-[#d4af5f] opacity-40" />
        </div>
        <h1
          className="text-[#1a1209] text-4xl leading-tight font-normal"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Welcome <em className="italic text-[#5c4a1e]">back,</em>
        </h1>
        <p className="mt-2 text-[#8a7560] text-base italic">
          Sign in to your reading account
        </p>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 border-l-2 border-[#8b3a3a] bg-[#8b3a3a]/5 text-[#8b3a3a] text-sm italic rounded-r">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-5 px-4 py-3 border-l-2 border-[#3a6b4a] bg-[#3a6b4a]/5 text-[#3a6b4a] text-sm italic rounded-r">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div
          className={`transition-all duration-600 delay-150 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
        >
          <label className="block text-[0.7rem] tracking-[0.2em] uppercase text-[#8a7560] mb-2">
            Email Address
          </label>
          <div className="relative group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full px-0 py-3 bg-transparent border-b border-[#c8b99a] text-[#1a1209] placeholder-[#c8b99a] text-base italic outline-none focus:border-[#1a1209] transition-colors duration-300"
              style={{ fontFamily: "Georgia, serif" }}
            />
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#d4af5f] group-focus-within:w-full transition-all duration-500" />
          </div>
        </div>

        {/* Password */}
        <div
          className={`transition-all duration-600 delay-200 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
        >
          <label className="block text-[0.7rem] tracking-[0.2em] uppercase text-[#8a7560] mb-2">
            Password
          </label>
          <div className="relative group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Your secret passphrase"
              className="w-full px-0 py-3 pr-12 bg-transparent border-b border-[#c8b99a] text-[#1a1209] placeholder-[#c8b99a] text-base italic outline-none focus:border-[#1a1209] transition-colors duration-300"
              style={{ fontFamily: "Georgia, serif" }}
            />
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#d4af5f] group-focus-within:w-full transition-all duration-500" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-3 text-[#8a7560] hover:text-[#1a1209] transition-colors text-xs tracking-widest uppercase cursor-pointer bg-transparent border-none"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Forgot */}
        <div
          className={`text-right -mt-2 transition-all duration-600 delay-220 ${mounted ? "opacity-100" : "opacity-0"}`}
        >
          <button
            type="button"
            className="text-[#8a7560] text-sm italic hover:text-[#1a1209] transition-colors cursor-pointer bg-transparent border-none"
          >
            Forgot your password?
          </button>
        </div>

        {/* Submit */}
        <div
          className={`transition-all duration-600 delay-260 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
        >
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#1a1209] text-[#f5f0e8] text-sm tracking-[0.25em] uppercase relative overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer border-none"
          >
            <span className="absolute inset-0 bg-[#d4af5f] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            <span className="relative group-hover:text-[#1a1209] transition-colors duration-300">
              {loading ? "Opening the door..." : "Enter the Library"}
            </span>
          </button>
        </div>
      </form>

      <div
        className={`flex items-center gap-4 my-6 transition-all duration-600 delay-300 ${mounted ? "opacity-100" : "opacity-0"}`}
      >
        <div className="flex-1 h-px bg-[#c8b99a] opacity-50" />
        <span className="text-[#8a7560] text-xs tracking-widest uppercase">
          or
        </span>
        <div className="flex-1 h-px bg-[#c8b99a] opacity-50" />
      </div>

      <p
        className={`text-center text-[#8a7560] text-sm transition-all duration-600 delay-320 ${mounted ? "opacity-100" : "opacity-0"}`}
      >
        New to the bookstore?{" "}
        <button
          onClick={onSwitch}
          className="text-[#1a1209] font-semibold underline underline-offset-2 hover:text-[#d4af5f] transition-colors duration-200 bg-transparent border-none cursor-pointer"
        >
          Create an account
        </button>
      </p>
      <p
        className={`text-center text-[#c8b99a] text-xs mt-6 italic transition-all duration-600 delay-350 ${mounted ? "opacity-100" : "opacity-0"}`}
      >
        Est. 2024 · Folio & Ink Bookstore
      </p>
    </div>
  );
}

function RegisterForm({ onSwitch, mounted }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const { confirm_password, ...payload } = formData;
      const res = await fetch(getApiUrl("api/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setSuccess("Your account has been created. Welcome to the library!");
        setTimeout(() => onSwitch(), 1500);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: "first_name",
      label: "First Name",
      type: "text",
      placeholder: "John",
      half: true,
    },
    {
      name: "last_name",
      label: "Last Name",
      type: "text",
      placeholder: "Doe",
      half: true,
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "you@example.com",
      half: false,
    },
    {
      name: "phone",
      label: "Phone (optional)",
      type: "tel",
      placeholder: "+1 234 567 890",
      half: true,
    },
    {
      name: "address",
      label: "Address (optional)",
      type: "text",
      placeholder: "123 Book St.",
      half: true,
    },
  ];

  return (
    <div className="flex flex-col justify-center h-full px-10 py-10 overflow-y-auto">
      {/* Header */}
      <div
        className={`mb-7 transition-all duration-600 delay-100 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px flex-1 bg-[#d4af5f] opacity-40" />
          <span className="text-[#d4af5f] text-[0.65rem] tracking-[0.35em] uppercase">
            Folio & Ink
          </span>
          <div className="h-px flex-1 bg-[#d4af5f] opacity-40" />
        </div>
        <h1
          className="text-[#1a1209] text-4xl leading-tight font-normal"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Begin your <em className="italic text-[#5c4a1e]">story.</em>
        </h1>
        <p className="mt-2 text-[#8a7560] text-base italic">
          Create your reader's account
        </p>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 border-l-2 border-[#8b3a3a] bg-[#8b3a3a]/5 text-[#8b3a3a] text-sm italic rounded-r">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 px-4 py-3 border-l-2 border-[#3a6b4a] bg-[#3a6b4a]/5 text-[#3a6b4a] text-sm italic rounded-r">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap gap-x-5">
          {fields.map((field, i) => (
            <div
              key={field.name}
              className={`${field.half ? "w-[calc(50%-10px)]" : "w-full"} mb-5 transition-all duration-600 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
              style={{ transitionDelay: `${150 + i * 40}ms` }}
            >
              <label className="block text-[0.7rem] tracking-[0.2em] uppercase text-[#8a7560] mb-2">
                {field.label}
              </label>
              <div className="relative group">
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={!field.label.includes("optional")}
                  placeholder={field.placeholder}
                  className="w-full px-0 py-2.5 bg-transparent border-b border-[#c8b99a] text-[#1a1209] placeholder-[#c8b99a] text-base italic outline-none focus:border-[#1a1209] transition-colors duration-300"
                  style={{ fontFamily: "Georgia, serif" }}
                />
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#d4af5f] group-focus-within:w-full transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Password row */}
        <div className="flex gap-x-5">
          {[
            {
              name: "password",
              label: "Password",
              show: showPassword,
              toggle: () => setShowPassword(!showPassword),
              placeholder: "Create a passphrase",
              delay: "370ms",
            },
            {
              name: "confirm_password",
              label: "Confirm Password",
              show: showConfirm,
              toggle: () => setShowConfirm(!showConfirm),
              placeholder: "Repeat passphrase",
              delay: "410ms",
            },
          ].map((f) => (
            <div
              key={f.name}
              className={`w-[calc(50%-10px)] mb-6 transition-all duration-600 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
              style={{ transitionDelay: f.delay }}
            >
              <label className="block text-[0.7rem] tracking-[0.2em] uppercase text-[#8a7560] mb-2">
                {f.label}
              </label>
              <div className="relative group">
                <input
                  type={f.show ? "text" : "password"}
                  name={f.name}
                  value={formData[f.name]}
                  onChange={handleChange}
                  required
                  placeholder={f.placeholder}
                  className="w-full px-0 py-2.5 pr-10 bg-transparent border-b border-[#c8b99a] text-[#1a1209] placeholder-[#c8b99a] text-base italic outline-none focus:border-[#1a1209] transition-colors duration-300"
                  style={{ fontFamily: "Georgia, serif" }}
                />
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#d4af5f] group-focus-within:w-full transition-all duration-500" />
                <button
                  type="button"
                  onClick={f.toggle}
                  className="absolute right-0 top-2.5 text-[#8a7560] hover:text-[#1a1209] transition-colors text-xs tracking-widest uppercase cursor-pointer bg-transparent border-none"
                >
                  {f.show ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div
          className={`transition-all duration-600 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
          style={{ transitionDelay: "450ms" }}
        >
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#1a1209] text-[#f5f0e8] text-sm tracking-[0.25em] uppercase relative overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer border-none"
          >
            <span className="absolute inset-0 bg-[#d4af5f] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            <span className="relative group-hover:text-[#1a1209] transition-colors duration-300">
              {loading ? "Registering..." : "Open an Account"}
            </span>
          </button>
        </div>
      </form>

      <div
        className={`flex items-center gap-4 my-5 transition-all duration-600 ${mounted ? "opacity-100" : "opacity-0"}`}
        style={{ transitionDelay: "500ms" }}
      >
        <div className="flex-1 h-px bg-[#c8b99a] opacity-50" />
        <span className="text-[#8a7560] text-xs tracking-widest uppercase">
          or
        </span>
        <div className="flex-1 h-px bg-[#c8b99a] opacity-50" />
      </div>

      <p
        className={`text-center text-[#8a7560] text-sm transition-all duration-600 ${mounted ? "opacity-100" : "opacity-0"}`}
        style={{ transitionDelay: "530ms" }}
      >
        Already have an account?{" "}
        <button
          onClick={onSwitch}
          className="text-[#1a1209] font-semibold underline underline-offset-2 hover:text-[#d4af5f] transition-colors duration-200 bg-transparent border-none cursor-pointer"
        >
          Sign in
        </button>
      </p>
      <p
        className={`text-center text-[#c8b99a] text-xs mt-5 italic transition-all duration-600 ${mounted ? "opacity-100" : "opacity-0"}`}
        style={{ transitionDelay: "560ms" }}
      >
        Est. 2024 · Folio & Ink Bookstore
      </p>
    </div>
  );
}

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [animating, setAnimating] = useState(false);
  const [formVisible, setFormVisible] = useState(true);
  const [panelVisible, setPanelVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const handleSwitch = () => {
    if (animating) return;
    setAnimating(true);

    // 1. Fade out both sides
    setFormVisible(false);
    setPanelVisible(false);

    // 2. After fade, swap mode & fade back in
    setTimeout(() => {
      setMode((prev) => (prev === "login" ? "register" : "login"));
      setTimeout(() => {
        setFormVisible(true);
        setPanelVisible(true);
        setAnimating(false);
      }, 80);
    }, 350);
  };

  const isLogin = mode === "login";

  return (
    <div className="min-h-screen flex bg-[#f5f0e8] overflow-hidden">
      {/* ═══ DESKTOP LAYOUT ═══ */}
      <div className="hidden lg:flex w-full relative">
        {/* Dark decorative panel — slides left↔right */}
        <div
          className="absolute top-0 bottom-0 w-[55%] bg-[#1a1209] z-10 overflow-hidden"
          style={{
            left: isLogin ? "0%" : "45%",
            transition: animating
              ? "left 0.6s cubic-bezier(0.77, 0, 0.175, 1)"
              : "left 0.6s cubic-bezier(0.77, 0, 0.175, 1)",
            clipPath: isLogin
              ? "polygon(0 0, 92% 0, 100% 100%, 0 100%)"
              : "polygon(0 0, 100% 0, 100% 100%, 8% 100%)",
          }}
        >
          {/* Grid texture */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(212,175,95,0.6) 39px, rgba(212,175,95,0.6) 40px),
              repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(212,175,95,0.3) 39px, rgba(212,175,95,0.3) 40px)
            `,
            }}
          />
          <div
            className="absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(212,175,95,0.15) 0%, transparent 70%)",
            }}
          />

          {/* Content fades in/out */}
          <div
            className={`h-full transition-opacity duration-300 ${panelVisible ? "opacity-100" : "opacity-0"}`}
          >
            <DecorativePanel mode={mode} visible={panelVisible} />
          </div>
        </div>

        {/* Gold border line on form side */}
        <div
          className="absolute top-0 bottom-0 w-px z-20 pointer-events-none"
          style={{
            left: isLogin ? "calc(55% - 8px)" : "calc(45% + 8px)",
            background:
              "linear-gradient(to bottom, transparent, #d4af5f 30%, #d4af5f 70%, transparent)",
            opacity: 0.4,
            transition: "left 0.6s cubic-bezier(0.77, 0, 0.175, 1)",
          }}
        />

        {/* Form area — positioned on opposite side from panel */}
        <div
          className="absolute top-0 bottom-0 overflow-y-auto"
          style={{
            left: isLogin ? "55%" : "0%",
            width: "45%",
            transition: "left 0.6s cubic-bezier(0.77, 0, 0.175, 1)",
          }}
        >
          <div
            className={`h-full transition-opacity duration-300 ${formVisible ? "opacity-100" : "opacity-0"}`}
          >
            {mode === "login" ? (
              <LoginForm onSwitch={handleSwitch} mounted={mounted} />
            ) : (
              <RegisterForm onSwitch={handleSwitch} mounted={mounted} />
            )}
          </div>
        </div>
      </div>

      {/* ═══ MOBILE LAYOUT — simple stack, no slide ═══ */}
      <div className="flex lg:hidden flex-col w-full">
        {/* Mini header banner */}
        <div className="bg-[#1a1209] px-6 py-8 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(212,175,95,0.6) 19px, rgba(212,175,95,0.6) 20px)`,
            }}
          />
          <p className="relative text-[#d4af5f] tracking-[0.3em] uppercase text-xs mb-1">
            Folio & Ink
          </p>
          <p
            className="relative text-[#f5f0e8] text-xl italic"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {isLogin
              ? '"A reader lives a thousand lives."'
              : '"There is no friend as loyal as a book."'}
          </p>
        </div>

        {/* Form */}
        <div
          className={`flex-1 overflow-y-auto transition-opacity duration-300 ${formVisible ? "opacity-100" : "opacity-0"}`}
        >
          {mode === "login" ? (
            <LoginForm onSwitch={handleSwitch} mounted={mounted} />
          ) : (
            <RegisterForm onSwitch={handleSwitch} mounted={mounted} />
          )}
        </div>
      </div>
    </div>
  );
}
