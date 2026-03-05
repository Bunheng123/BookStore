import { useEffect, useState } from "react";
import { getApiUrl } from "../../apiConfig";
import ProfileModal from "../../components/ProfileModal";
import AdminHeader from "../../components/AdminHeader";

export default function ManageStaff() {
  const [staff, setStaff] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // modal/form state for adding new admin
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // view/edit staff info
  const [selectedStaff, setSelectedStaff] = useState(null);
  const openStaffModal = (staff) => setSelectedStaff(staff);
  const closeStaffModal = () => {
    setSelectedStaff(null);
    // reload in case profile was edited
    fetchStaff();
  };

  // Fetch staff list
  const fetchStaff = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(getApiUrl("api/admins"));
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setStaff(data.data || []);
      } else {
        setError(data.message || "Failed to load staff");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load staff on mount
  useEffect(() => {
    fetchStaff();
  }, []);

  // Delete staff handler
  const handleDeleteStaff = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff member?"))
      return;
    try {
      const res = await fetch(getApiUrl(`api/admins/${id}`), {
        method: "DELETE",
      });
      const data = await res.json();
      if (
        res.ok &&
        (data.status === "success" || data.message?.includes("deleted"))
      ) {
        fetchStaff();
      } else {
        alert(data.message || "Failed to delete staff");
      }
    } catch (err) {
      console.error("Error deleting staff:", err);
      alert("An error occurred while deleting staff");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <AdminHeader title="Manage Staff" />
        <div className="flex items-center gap-2">
          <input
            type="search"
            placeholder="Search name or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-3 py-2 border rounded-md"
          />
          <button
            onClick={fetchStaff}
            className="px-3 py-2 bg-[#d4af5f] rounded-md"
          >
            Refresh
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-2 bg-[#1a1209] text-[#f5f0e8] rounded-md"
          >
            + Add Admin
          </button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          <div className="overflow-x-auto bg-white border border-[#e5ddd0] shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f5f0e8] border-b border-[#e5ddd0]">
                  <th className="px-6 py-4 text-[0.65rem] tracking-[0.2em] uppercase text-[#8a7560] font-bold">
                    Name
                  </th>
                  <th className="px-6 py-4 text-[0.65rem] tracking-[0.2em] uppercase text-[#8a7560] font-bold">
                    Email
                  </th>
                  <th className="px-6 py-4 text-[0.65rem] tracking-[0.2em] uppercase text-[#8a7560] font-bold">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-[0.65rem] tracking-[0.2em] uppercase text-[#8a7560] font-bold">
                    Address
                  </th>
                  <th className="px-6 py-4 text-[0.65rem] tracking-[0.2em] uppercase text-[#8a7560] font-bold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f0e8]">
                {staff
                  .filter((s) => {
                    if (!query) return true;
                    const q = query.toLowerCase();
                    return (
                      `${s.first_name} ${s.last_name}`
                        .toLowerCase()
                        .includes(q) ||
                      (s.email || "").toLowerCase().includes(q)
                    );
                  })
                  .map((s) => (
                    <tr
                      key={s.id}
                      className="hover:bg-[#fdfaf5] transition-colors"
                    >
                      <td className="px-6 py-4">
                        {s.first_name} {s.last_name}
                      </td>
                      <td className="px-6 py-4">{s.email}</td>
                      <td className="px-6 py-4">{s.phone || "-"}</td>
                      <td className="px-6 py-4">{s.address || "-"}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openStaffModal(s)}
                            className="px-3 py-1.5 bg-[#f5f0e8] text-[0.65rem] tracking-widest uppercase text-[#1a1209] hover:bg-[#d4af5f] transition-all duration-200 border border-[#e5ddd0] hover:border-[#d4af5f] shadow-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteStaff(s.id)}
                            className="px-3 py-1.5 bg-red-50 text-[0.65rem] tracking-widest uppercase text-red-700 hover:bg-red-600 hover:text-white transition-all duration-200 border border-red-100 hover:border-red-600 shadow-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* add admin modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden">
                <div className="bg-[#1a1209] px-6 py-4 flex justify-between items-center">
                  <h2 className="text-[#f5f0e8] text-lg font-semibold">
                    New Admin
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-[#d4af5f] hover:text-[#f5f0e8]"
                  >
                    ✕
                  </button>
                </div>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setSaving(true);
                    setSaveError("");
                    try {
                      const res = await fetch(getApiUrl("api/admin/register"), {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(formData),
                      });
                      const data = await res.json();
                      if (res.ok && data.status === "success") {
                        setIsModalOpen(false);
                        setFormData({
                          first_name: "",
                          last_name: "",
                          email: "",
                          password: "",
                          phone: "",
                          address: "",
                        });
                        fetchStaff();
                      } else {
                        setSaveError(data.message || "Failed to add admin");
                      }
                    } catch (err) {
                      setSaveError(err.message);
                    } finally {
                      setSaving(false);
                    }
                  }}
                  className="px-6 py-4 space-y-4"
                >
                  {saveError && (
                    <p className="text-red-600 text-sm">{saveError}</p>
                  )}
                  <div>
                    <label className="block text-sm font-bold mb-1">
                      First Name
                    </label>
                    <input
                      required
                      name="first_name"
                      value={formData.first_name}
                      onChange={(e) =>
                        setFormData((f) => ({
                          ...f,
                          [e.target.name]: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">
                      Last Name
                    </label>
                    <input
                      name="last_name"
                      value={formData.last_name}
                      onChange={(e) =>
                        setFormData((f) => ({
                          ...f,
                          [e.target.name]: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((f) => ({
                          ...f,
                          [e.target.name]: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">
                      Password
                    </label>
                    <input
                      required
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData((f) => ({
                          ...f,
                          [e.target.name]: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">
                      Phone
                    </label>
                    <input
                      name="phone"
                      value={formData.phone || ""}
                      onChange={(e) =>
                        setFormData((f) => ({
                          ...f,
                          [e.target.name]: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1">
                      Address
                    </label>
                    <input
                      name="address"
                      value={formData.address || ""}
                      onChange={(e) =>
                        setFormData((f) => ({
                          ...f,
                          [e.target.name]: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-gray-300 rounded"
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#1a1209] text-white rounded"
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* profile / edit modal for selected staff */}
          {selectedStaff && (
            <ProfileModal
              isOpen={!!selectedStaff}
              onClose={closeStaffModal}
              user={selectedStaff}
              role="admin"
            />
          )}
        </>
      )}
    </div>
  );
}
