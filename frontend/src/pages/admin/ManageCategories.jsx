import { useEffect, useState } from "react";
import { getApiUrl } from "../../apiConfig";
import AdminHeader from "../../components/AdminHeader";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "" });
  const [saveError, setSaveError] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl("api/categories"));
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setCategories(data.data || []);
      } else {
        console.error(data.message || "Failed to fetch categories");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (category = null) => {
    setEditingCategory(category);
    setFormData({ name: category?.name || "" });
    setSaveError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: "" });
    setSaveError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setSaveError("Category name cannot be blank.");
      return;
    }

    const url = editingCategory
      ? getApiUrl(`api/categories/${editingCategory.id}`)
      : getApiUrl("api/categories");
    const method = editingCategory ? "PUT" : "POST";

    try {
      setSaveError("");
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        closeModal();
        fetchCategories();
      } else {
        setSaveError(data.message || "Failed to save category.");
      }
    } catch (err) {
      setSaveError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category? This action cannot be undone."))
      return;

    try {
      const res = await fetch(getApiUrl(`api/categories/${id}`), {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        fetchCategories();
      } else {
        alert(data.message || "Failed to delete category.");
      }
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("An error occurred while deleting the category.");
    }
  };

  const filteredCategories = categories.filter((category) => {
    if (!query) return true;
    return category.name?.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <AdminHeader
          title="Manage Categories"
          description="Create, edit, and remove book categories."
        />
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <input
            type="search"
            placeholder="Search categories"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-3 py-2 border border-[#e5ddd0] rounded-md w-full sm:w-72"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#1a1209] text-[#f5f0e8] rounded-md hover:bg-[#d4af5f] hover:text-[#1a1209] transition-all duration-200"
          >
            + Add Category
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white border border-[#e5ddd0] shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#f5f0e8] border-b border-[#e5ddd0]">
              <th className="px-6 py-4 text-[0.65rem] tracking-[0.2em] uppercase text-[#8a7560] font-bold">
                Category Name
              </th>
              <th className="px-6 py-4 text-[0.65rem] tracking-[0.2em] uppercase text-[#8a7560] font-bold text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f5f0e8]">
            {loading ? (
              <tr>
                <td
                  colSpan="2"
                  className="px-6 py-12 text-center italic text-gray-400"
                >
                  Loading categories...
                </td>
              </tr>
            ) : filteredCategories.length === 0 ? (
              <tr>
                <td
                  colSpan="2"
                  className="px-6 py-12 text-center italic text-gray-400"
                >
                  No categories found.
                </td>
              </tr>
            ) : (
              filteredCategories.map((category) => (
                <tr
                  key={category.id}
                  className="hover:bg-[#fdfaf5] transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-[#1a1209]">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => openModal(category)}
                        className="px-3 py-1.5 bg-[#f5f0e8] text-[0.65rem] uppercase tracking-widest text-[#1a1209] border border-[#e5ddd0] hover:bg-[#d4af5f] hover:text-[#1a1209] transition-all duration-200 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="px-3 py-1.5 bg-red-50 text-[0.65rem] uppercase tracking-widest text-red-700 border border-red-100 hover:bg-red-600 hover:text-white transition-all duration-200 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden border border-[#d4af5f]">
            <div className="bg-[#1a1209] px-6 py-4 flex justify-between items-center">
              <h2 className="text-[#f5f0e8] text-lg font-semibold">
                {editingCategory ? "Edit Category" : "New Category"}
              </h2>
              <button
                onClick={closeModal}
                className="text-[#d4af5f] hover:text-[#f5f0e8]"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
              {saveError && <p className="text-red-600 text-sm">{saveError}</p>}
              <div>
                <label className="block text-sm font-bold mb-1">
                  Category Name
                </label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e5ddd0] rounded-md focus:outline-none focus:border-[#d4af5f]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-[#e5ddd0]">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1a1209] text-[#f5f0e8] rounded-md hover:bg-[#d4af5f] hover:text-[#1a1209] transition-all duration-200"
                >
                  {editingCategory ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
