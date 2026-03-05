import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, getApiUrl } from "../apiConfig";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(getApiUrl("api/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setSuccess("Welcome back, reader.");
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setTimeout(() => navigate("/dashboard"), 1200);
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
    <div className="min-h-screen flex bg-[#f5f0e8] overflow-hidden">
      {/* ── Left decorative panel ── */}
      <div
        className="hidden lg:flex flex-col justify-end flex-1 relative bg-[#1a1209] overflow-hidden"
        style={{ clipPath: "polygon(0 0, 92% 0, 100% 100%, 0 100%)" }}
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

        {/* Glow */}
        <div
          className="absolute -top-48 -left-48 w-150 h-150 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(212,175,95,0.15) 0%, transparent 70%)",
          }}
        />

        {/* Book spine decorations */}
        <div className="absolute top-10 right-12 flex gap-2 items-end">
          {[80, 110, 65, 95, 120, 75, 100].map((h, i) => (
            <div
              key={i}
              className="w-3 rounded-sm"
              style={{
                height: `${h}px`,
                background: `rgba(212,175,95,${0.15 + i * 0.08})`,
                borderTop: "2px solid rgba(212,175,95,0.5)",
              }}
            />
          ))}
        </div>

        {/* Quote */}
        <div
          className={`relative z-10 p-12 transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p className="text-[#d4af5f] tracking-[0.3em] uppercase text-xs mb-4">
            Folio & Ink Bookstore
          </p>
          <p
            className="text-[#f5f0e8] text-3xl xl:text-4xl leading-snug italic"
            style={{ fontFamily: "Georgia, serif" }}
          >
            "A reader lives a thousand{" "}
            <span className="text-[#d4af5f]">lives</span> before he dies."
          </p>
          <p className="mt-4 text-xs tracking-[0.2em] uppercase text-white/30">
            — George R.R. Martin
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="w-full lg:w-110 lg:min-w-105 flex flex-col justify-center px-10 py-12 bg-[#f5f0e8] relative pt-20 lg:pt-12">
        {/* Gold left border (desktop) */}
        <div
          className="hidden lg:block absolute top-0 left-0 w-px h-full"
          style={{
            background:
              "linear-gradient(to bottom, transparent, #d4af5f 30%, #d4af5f 70%, transparent)",
            opacity: 0.4,
          }}
        />

        {/* Return home button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 right-4 lg:top-6 lg:right-6 z-50 text-[#8a7560] hover:text-[#1a1209] transition-colors text-sm tracking-[0.15em] uppercase bg-transparent border-none cursor-pointer flex items-center gap-1 font-medium"
          title="Return to Home"
        >
          <span>←</span>
          <span className="hidden sm:inline">Home</span>
        </button>

        {/* Header */}
        <div
          className={`mb-8 transition-all duration-700 delay-100 ${
            mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
          }`}
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

        {/* Error */}
        {error && (
          <div className="mb-5 px-4 py-3 border-l-2 border-[#8b3a3a] bg-[#8b3a3a]/5 text-[#8b3a3a] text-sm italic rounded-r">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-5 px-4 py-3 border-l-2 border-[#3a6b4a] bg-[#3a6b4a]/5 text-[#3a6b4a] text-sm italic rounded-r">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div
            className={`transition-all duration-700 delay-150 ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
            }`}
          >
            <label
              htmlFor="email"
              className="block text-[0.7rem] tracking-[0.2em] uppercase text-[#8a7560] mb-2"
            >
              Email Address
            </label>
            <div className="relative group">
              <input
                type="email"
                id="email"
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
            className={`transition-all duration-700 delay-200 ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
            }`}
          >
            <label
              htmlFor="password"
              className="block text-[0.7rem] tracking-[0.2em] uppercase text-[#8a7560] mb-2"
            >
              Password
            </label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
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

          {/* Forgot password */}
          <div
            className={`text-right -mt-2 transition-all duration-700 delay-220 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-[#8a7560] text-sm italic hover:text-[#1a1209] transition-colors cursor-pointer bg-transparent border-none"
            >
              Forgot your password?
            </button>
          </div>

          {/* Submit */}
          <div
            className={`transition-all duration-700 delay-260 ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
            }`}
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

        {/* Divider */}
        <div
          className={`flex items-center gap-4 my-6 transition-all duration-700 delay-300 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex-1 h-px bg-[#c8b99a] opacity-50" />
          <span className="text-[#8a7560] text-xs tracking-widest uppercase">
            or
          </span>
          <div className="flex-1 h-px bg-[#c8b99a] opacity-50" />
        </div>

        {/* Sign up */}
        <p
          className={`text-center text-[#8a7560] text-sm transition-all duration-700 delay-320 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          New to the bookstore?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-[#1a1209] font-semibold underline underline-offset-2 hover:text-[#d4af5f] transition-colors duration-200 bg-transparent border-none cursor-pointer"
          >
            Create an account
          </button>
        </p>

        {/* Footer */}
        <p
          className={`text-center text-[#c8b99a] text-xs mt-8 italic transition-all duration-700 delay-350 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          Est. 2024 · Folio & Ink Bookstore
        </p>
      </div>
    </div>
  );
}
