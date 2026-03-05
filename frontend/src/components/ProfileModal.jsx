import { useState } from "react";
import { getApiUrl } from "../apiConfig";

export default function ProfileModal({ isOpen, onClose, user = {}, role }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const isAdmin = role === "admin";
  const firstName = user.first_name || "User";
  const lastName = user.last_name || "";
  const email = user.email || "N/A";
  const phone = user.phone && user.phone.trim() ? user.phone : "Not provided";
  const address =
    user.address && user.address.trim() ? user.address : "Not provided";
  const userId = user.id || "N/A";

  const formatDate = (dateString) => {
    if (!dateString || dateString === "Unknown") return "Not available";
    try {
      const d = new Date(dateString);
      if (isNaN(d)) throw new Error("invalid date");
      return d.toLocaleDateString();
    } catch {
      return "Not available";
    }
  };

  const createdAt = formatDate(user.created_at);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    try {
      const url =
        role === "admin"
          ? getApiUrl(`api/admin/${userId}`)
          : getApiUrl(`api/customers/${userId}`);
      const payload = {
        first_name: editData.first_name,
        last_name: editData.last_name,
        email: editData.email,
        phone: editData.phone,
        address: editData.address,
      };
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setMessage("Profile saved");
        setIsEditing(false);
        try {
          const updated = { ...user, ...payload };
          localStorage.setItem("user", JSON.stringify(updated));
        } catch {}
      } else {
        setMessage(data.message || "Failed to save");
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#f5f0e8] w-full max-w-md rounded-lg shadow-2xl overflow-hidden">
        {/* header */}
        <div className="bg-[#1a1209] px-6 py-4 flex justify-between items-center">
          <h2 className="text-[#f5f0e8] text-lg font-semibold">Profile</h2>
          <button
            onClick={onClose}
            className="text-[#d4af5f] hover:text-[#f5f0e8]"
          >
            ✕
          </button>
        </div>

        {/* body */}
        <div className="px-6 py-4 space-y-4 text-[#1a1209]">
          {message && <p className="text-sm text-red-600">{message}</p>}

          {/* Name */}
          <div>
            <p className="text-[0.65rem] font-bold text-[#8a7560] uppercase tracking-widest mb-1">
              Name
            </p>
            {isEditing ? (
              <div className="flex gap-2">
                <input
                  name="first_name"
                  value={editData.first_name}
                  onChange={handleEditChange}
                  placeholder="First"
                  className="w-1/2 px-3 py-2 border border-[#c8b99a] rounded bg-white text-[#1a1209] focus:outline-none focus:border-[#d4af5f]"
                />
                <input
                  name="last_name"
                  value={editData.last_name}
                  onChange={handleEditChange}
                  placeholder="Last"
                  className="w-1/2 px-3 py-2 border border-[#c8b99a] rounded bg-white text-[#1a1209] focus:outline-none focus:border-[#d4af5f]"
                />
              </div>
            ) : (
              <p className="text-sm text-[#1a1209]">
                {firstName} {lastName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <p className="text-[0.65rem] font-bold text-[#8a7560] uppercase tracking-widest mb-1">
              Email Address
            </p>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-[#c8b99a] rounded bg-white text-[#1a1209] focus:outline-none focus:border-[#d4af5f]"
              />
            ) : (
              <p className="text-sm text-[#1a1209] break-all">{email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <p className="text-[0.65rem] font-bold text-[#8a7560] uppercase tracking-widest mb-1">
              Phone Number
            </p>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={editData.phone}
                onChange={handleEditChange}
                placeholder="Optional"
                className="w-full px-3 py-2 border border-[#c8b99a] rounded bg-white text-[#1a1209] placeholder-[#c8b99a] focus:outline-none focus:border-[#d4af5f]"
              />
            ) : (
              <p className="text-sm text-[#1a1209]">{phone}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <p className="text-[0.65rem] font-bold text-[#8a7560] uppercase tracking-widest mb-1">
              Address
            </p>
            {isEditing ? (
              <textarea
                name="address"
                value={editData.address}
                onChange={handleEditChange}
                placeholder="Optional"
                rows="3"
                className="w-full px-3 py-2 border border-[#c8b99a] rounded bg-white text-[#1a1209] placeholder-[#c8b99a] focus:outline-none focus:border-[#d4af5f] resize-none"
              />
            ) : (
              <p className="text-sm text-[#1a1209]">{address}</p>
            )}
          </div>

          {/* Member since */}
          <div className="pt-3 border-t border-[#c8b99a]">
            <p className="text-[0.65rem] font-bold text-[#8a7560] uppercase tracking-widest mb-1">
              Member Since
            </p>
            <p className="text-sm text-[#1a1209]">{createdAt}</p>
          </div>
        </div>

        {/* footer */}
        <div className="px-6 py-4 bg-[#f5f0e8]/50 border-t border-[#e5ddd0] flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditData({
                    first_name: user.first_name || "",
                    last_name: user.last_name || "",
                    email: user.email || "",
                    phone: user.phone || "",
                    address: user.address || "",
                  });
                  setMessage("");
                }}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-[#8a7560] text-[#f5f0e8] text-sm tracking-[0.15em] uppercase rounded transition-colors duration-200 hover:bg-[#6b5a4a] disabled:opacity-50 border-none cursor-pointer font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-[#1a1209] text-[#f5f0e8] text-sm tracking-[0.15em] uppercase rounded transition-colors duration-200 hover:bg-[#5c4a1e] disabled:opacity-50 border-none cursor-pointer font-medium"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 px-4 py-2 bg-[#d4af5f] text-[#1a1209] text-sm tracking-[0.15em] uppercase rounded transition-colors duration-200 hover:bg-[#c89f4f] border-none cursor-pointer font-medium"
              >
                Edit
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-[#1a1209] text-[#f5f0e8] text-sm tracking-[0.15em] uppercase rounded transition-colors duration-200 hover:bg-[#5c4a1e] border-none cursor-pointer font-medium"
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
