import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, getApiUrl } from "../apiConfig";

export default function Register() {
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
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { confirm_password, ...payload } = formData;

      const response = await fetch(getApiUrl("api/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setSuccess("Your account has been created. Welcome to the library!");
        setTimeout(() => navigate("/login"), 1500);
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
          {[90, 60, 115, 75, 100, 55, 130, 80].map((h, i) => (
            <div
              key={i}
              className="w-3 rounded-sm"
              style={{
                height: `${h}px`,
                background: `rgba(212,175,95,${0.12 + i * 0.07})`,
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
            "There is no <span className="text-[#d4af5f]">friend</span> as loyal
            as a book."
          </p>
          <p className="mt-4 text-xs tracking-[0.2em] uppercase text-white/30">
            — Ernest Hemingway
          </p>

          {/* Decorative divider */}
          <div className="flex items-center gap-3 mt-8">
            <div className="h-px w-8 bg-[#d4af5f] opacity-50" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#d4af5f] opacity-50" />
            <div className="h-px w-8 bg-[#d4af5f] opacity-50" />
          </div>

          <p className="mt-6 text-[#f5f0e8]/40 text-sm italic leading-relaxed max-w-xs">
            Join thousands of readers discovering their next favourite story.
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="w-full lg:w-125 lg:min-w-115 flex flex-col justify-center px-10 py-10 bg-[#f5f0e8] relative overflow-y-auto pt-20 lg:pt-10">
        {/* Gold left border */}
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
          className={`mb-7 transition-all duration-700 delay-100 ${
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
            Begin your <em className="italic text-[#5c4a1e]">story.</em>
          </h1>
          <p className="mt-2 text-[#8a7560] text-base italic">
            Create your reader's account
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

        <form onSubmit={handleSubmit}>
          {/* First/Last name row + other fields */}
          <div className="flex flex-wrap gap-x-6">
            {fields.map((field, i) => (
              <div
                key={field.name}
                className={`${field.half ? "w-[calc(50%-12px)]" : "w-full"} mb-5 transition-all duration-700 ${
                  mounted
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-6"
                }`}
                style={{ transitionDelay: `${150 + i * 50}ms` }}
              >
                <label
                  htmlFor={field.name}
                  className="block text-[0.7rem] tracking-[0.2em] uppercase text-[#8a7560] mb-2"
                >
                  {field.label}
                </label>
                <div className="relative group">
                  <input
                    type={field.type}
                    id={field.name}
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

          {/* Password */}
          <div
            className={`mb-5 transition-all duration-700 ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
            }`}
            style={{ transitionDelay: "400ms" }}
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
                placeholder="Create a passphrase"
                className="w-full px-0 py-2.5 pr-12 bg-transparent border-b border-[#c8b99a] text-[#1a1209] placeholder-[#c8b99a] text-base italic outline-none focus:border-[#1a1209] transition-colors duration-300"
                style={{ fontFamily: "Georgia, serif" }}
              />
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#d4af5f] group-focus-within:w-full transition-all duration-500" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-2.5 text-[#8a7560] hover:text-[#1a1209] transition-colors text-xs tracking-widest uppercase cursor-pointer bg-transparent border-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div
            className={`mb-7 transition-all duration-700 ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
            }`}
            style={{ transitionDelay: "450ms" }}
          >
            <label
              htmlFor="confirm_password"
              className="block text-[0.7rem] tracking-[0.2em] uppercase text-[#8a7560] mb-2"
            >
              Confirm Password
            </label>
            <div className="relative group">
              <input
                type={showConfirm ? "text" : "password"}
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
                placeholder="Repeat your passphrase"
                className="w-full px-0 py-2.5 pr-12 bg-transparent border-b border-[#c8b99a] text-[#1a1209] placeholder-[#c8b99a] text-base italic outline-none focus:border-[#1a1209] transition-colors duration-300"
                style={{ fontFamily: "Georgia, serif" }}
              />
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#d4af5f] group-focus-within:w-full transition-all duration-500" />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-0 top-2.5 text-[#8a7560] hover:text-[#1a1209] transition-colors text-xs tracking-widest uppercase cursor-pointer bg-transparent border-none"
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Submit */}
          <div
            className={`transition-all duration-700 ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#1a1209] text-[#f5f0e8] text-sm tracking-[0.25em] uppercase relative overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer border-none"
            >
              <span className="absolute inset-0 bg-[#d4af5f] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
              <span className="relative group-hover:text-[#1a1209] transition-colors duration-300">
                {loading ? "Registering your account..." : "Open an Account"}
              </span>
            </button>
          </div>
        </form>

        {/* Divider */}
        <div
          className={`flex items-center gap-4 my-5 transition-all duration-700 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "550ms" }}
        >
          <div className="flex-1 h-px bg-[#c8b99a] opacity-50" />
          <span className="text-[#8a7560] text-xs tracking-widest uppercase">
            or
          </span>
          <div className="flex-1 h-px bg-[#c8b99a] opacity-50" />
        </div>

        {/* Sign in */}
        <p
          className={`text-center text-[#8a7560] text-sm transition-all duration-700 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "580ms" }}
        >
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-[#1a1209] font-semibold underline underline-offset-2 hover:text-[#d4af5f] transition-colors duration-200 bg-transparent border-none cursor-pointer"
          >
            Sign in
          </button>
        </p>

        {/* Footer */}
        <p
          className={`text-center text-[#c8b99a] text-xs mt-6 italic transition-all duration-700 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          Est. 2024 · Folio & Ink Bookstore
        </p>
      </div>
    </div>
  );
}
