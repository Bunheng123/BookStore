import { useState, useEffect } from "react";
import { API_BASE_URL, getApiUrl } from "../../apiConfig";
import AdminHeader from "../../components/AdminHeader";
const ESPRESSO = "#1a1209";
const GOLD = "#d4af5f";
const PARCHMENT = "#f5f0e8";
const BROWN_MID = "#8a7560";

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showRestock, setShowRestock] = useState(false);
  const [restockBook, setRestockBook] = useState("");
  const [restockQty, setRestockQty] = useState(0);
  const [restockError, setRestockError] = useState("");
  const [restockLoading, setRestockLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author_id: "",
    category_id: "",
    price: "",
    stock: "",
    book_img: "",
    description: "",
    published_date: new Date().toISOString().split("T")[0],
  });

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl("api/books"));
      const data = await res.json();
      if (data.status === "success") {
        setBooks(data.data);
      }
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      const [authRes, catRes] = await Promise.all([
        fetch(getApiUrl("api/authors")),
        fetch(getApiUrl("api/categories")),
      ]);
      const [authData, catData] = await Promise.all([
        authRes.json(),
        catRes.json(),
      ]);

      if (authData.status === "success") setAuthors(authData.data);
      if (catData.status === "success") setCategories(catData.data);
    } catch (err) {
      console.error("Error fetching options:", err);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchOptions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = (book = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title || "",
        author_id: book.author_id || "",
        category_id: book.category_id || "",
        price: book.price || "",
        stock: book.stock || "",
        book_img: book.book_img || "",
        description: book.description || "",
        published_date:
          book.published_date || new Date().toISOString().split("T")[0],
      });
    } else {
      setEditingBook(null);
      setFormData({
        title: "",
        author_id: "",
        category_id: "",
        price: "",
        stock: "",
        book_img: "",
        description: "",
        published_date: new Date().toISOString().split("T")[0],
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingBook ? "PUT" : "POST";
    const url = editingBook
      ? getApiUrl(`api/books/${editingBook.id}`)
      : getApiUrl("api/books");

    // Ensure numeric values are correct types
    const submissionData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      author_id: parseInt(formData.author_id),
      category_id: parseInt(formData.category_id),
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });
      const data = await res.json();
      if (data.status === "success" || data.message?.includes("successfully")) {
        fetchBooks();
        closeModal();
      } else {
        alert(data.message || "Failed to save book.");
      }
    } catch (err) {
      console.error("Error saving book:", err);
      alert("An error occurred. Check console.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      const res = await fetch(getApiUrl(`api/books/${id}`), {
        method: "DELETE",
      });
      const data = await res.json();
      // Backend uses 'success' in one place and 'success' in another... checking both
      if (
        data.status === "success" ||
        data.success === "success" ||
        data.message?.includes("deleted")
      ) {
        fetchBooks();
      } else {
        alert(data.message || "Failed to delete book.");
      }
    } catch (err) {
      console.error("Error deleting book:", err);
      alert("An error occurred.");
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <AdminHeader
          title="Manage Books"
          description="Curate your collection of literary treasures."
        />
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Search by title or author..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e5ddd0] text-sm focus:outline-none focus:border-[#d4af5f] transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
          <button
            onClick={() => openModal()}
            className="px-6 py-2.5 bg-[#1a1209] text-[#f5f0e8] text-xs tracking-[0.2em] uppercase hover:bg-[#d4af5f] hover:text-[#1a1209] transition-all duration-300 shadow-sm"
          >
            Add New Entry
          </button>
          <button
            onClick={() => setShowRestock(true)}
            className="px-6 py-2.5 bg-[#d4af5f] text-[#1a1209] text-xs tracking-[0.2em] uppercase hover:bg-[#1a1209] hover:text-[#f5f0e8] transition-all duration-300 shadow-sm"
          >
            Restock
          </button>
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white border border-[#e5ddd0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f5f0e8] border-b border-[#e5ddd0]">
                <th className="px-6 py-4 text-[0.65rem] tracking-[0.2em] uppercase text-[#8a7560] font-bold">
                  Cover
                </th>
                <th className="px-6 py-4 text-[0.65rem] tracking-[0.2em] uppercase text-[#8a7560] font-bold">
                  Details
                </th>
                <th className="px-6 py-4 text-[0.65rem] tracking-[0.2em] uppercase text-[#8a7560] font-bold">
                  Stock / Price
                </th>
                <th className="px-6 py-4 text-[0.65rem] tracking-[0.2em] uppercase text-[#8a7560] font-bold">
                  Category
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
                    colSpan="5"
                    className="px-6 py-12 text-center italic text-gray-400"
                  >
                    Consulting the archives...
                  </td>
                </tr>
              ) : filteredBooks.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center italic text-gray-400"
                  >
                    No books found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr
                    key={book.id}
                    className="hover:bg-[#fdfaf5] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="w-16 h-20 bg-[#f5f0e8] border border-[#e5ddd0] overflow-hidden flex items-center justify-center relative group-hover:border-[#d4af5f] transition-colors shadow-sm">
                        {book.book_img ? (
                          <img
                            src={book.book_img}
                            alt={book.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://via.placeholder.com/150x200?text=No+Cover";
                            }}
                          />
                        ) : (
                          <div className="flex flex-col items-center opacity-30">
                            <span className="text-xl">📖</span>
                            <span className="text-[0.5rem] uppercase tracking-tighter">
                              No Image
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p
                        className="font-semibold text-sm leading-tight mb-0.5"
                        style={{ color: ESPRESSO }}
                      >
                        {book.title}
                      </p>
                      <p
                        className="text-xs italic"
                        style={{ color: BROWN_MID }}
                      >
                        {book.author_name} (ID: {book.author_id})
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span
                          className="text-sm font-semibold"
                          style={{ color: ESPRESSO }}
                        >
                          ${parseFloat(book.price || 0).toFixed(2)}
                        </span>
                        <span
                          className={`text-[10px] uppercase tracking-tighter ${book.stock <= 5 ? "text-red-500 font-bold" : "text-[#8a7560]"}`}
                        >
                          {book.stock} in stock {book.stock <= 5 && "— LOW"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-[#f5f0e8] text-[10px] uppercase tracking-widest text-[#8a7560]">
                        {book.category_name || `ID: ${book.category_id}`}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openModal(book)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f5f0e8] text-[0.65rem] tracking-widest uppercase text-[#1a1209] hover:bg-[#d4af5f] transition-all duration-200 border border-[#e5ddd0] hover:border-[#d4af5f] shadow-sm"
                          title="Edit Book"
                        >
                          <span className="text-xs">✎</span>
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-[0.65rem] tracking-widest uppercase text-red-700 hover:bg-red-600 hover:text-white transition-all duration-200 border border-red-100 hover:border-red-600 shadow-sm"
                          title="Delete Book"
                        >
                          <span className="text-xs">🗑</span>
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl shadow-2xl overflow-hidden border border-[#d4af5f]">
            <div className="bg-[#1a1209] px-8 py-6 flex justify-between items-center">
              <h2
                className="text-[#f5f0e8] text-xl font-normal italic"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {editingBook ? "Edit Literary Work" : "Catalog New Work"}
              </h2>
              <button
                onClick={closeModal}
                className="text-[#d4af5f] hover:text-[#f5f0e8] transition-colors"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-[0.65rem] tracking-widest uppercase text-[#8a7560] mb-1">
                    Title
                  </label>
                  <input
                    required
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-[#e5ddd0] focus:border-[#d4af5f] outline-none text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.65rem] tracking-widest uppercase text-[#8a7560] mb-1">
                      Author
                    </label>
                    <select
                      required
                      name="author_id"
                      value={formData.author_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-[#e5ddd0] focus:border-[#d4af5f] outline-none text-sm bg-white"
                    >
                      <option value="">Select Author</option>
                      {authors.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[0.65rem] tracking-widest uppercase text-[#8a7560] mb-1">
                      Category
                    </label>
                    <select
                      required
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-[#e5ddd0] focus:border-[#d4af5f] outline-none text-sm bg-white"
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.65rem] tracking-widest uppercase text-[#8a7560] mb-1">
                      Price ($)
                    </label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-[#e5ddd0] focus:border-[#d4af5f] outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.65rem] tracking-widest uppercase text-[#8a7560] mb-1">
                      Stock
                    </label>
                    <input
                      required
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-[#e5ddd0] focus:border-[#d4af5f] outline-none text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[0.65rem] tracking-widest uppercase text-[#8a7560] mb-1">
                    Published Date
                  </label>
                  <input
                    required
                    type="date"
                    name="published_date"
                    value={formData.published_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-[#e5ddd0] focus:border-[#d4af5f] outline-none text-sm"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[0.65rem] tracking-widest uppercase text-[#8a7560] mb-1">
                    Cover Image URL (book_img)
                  </label>
                  <input
                    name="book_img"
                    value={formData.book_img}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-[#e5ddd0] focus:border-[#d4af5f] outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[0.65rem] tracking-widest uppercase text-[#8a7560] mb-1">
                    Description
                  </label>
                  <textarea
                    rows="6"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-[#e5ddd0] focus:border-[#d4af5f] outline-none text-sm resize-none"
                  />
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-8 py-2.5 text-[0.65rem] tracking-widest uppercase text-[#8a7560] border border-[#e5ddd0] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-[#1a1209] text-[#f5f0e8] text-[0.65rem] tracking-widest uppercase hover:bg-[#d4af5f] hover:text-[#1a1209] transition-all duration-300"
                >
                  {editingBook ? "Apply Revisions" : "Add to Archives"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {showRestock && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden">
            <div className="bg-[#1a1209] px-6 py-4 flex justify-between items-center">
              <h2 className="text-[#f5f0e8] text-lg font-semibold">
                Restock Book
              </h2>
              <button
                onClick={() => setShowRestock(false)}
                className="text-[#d4af5f] hover:text-[#f5f0e8]"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setRestockLoading(true);
                setRestockError("");
                try {
                  const selected = books.find(
                    (b) => b.id === parseInt(restockBook),
                  );
                  if (!selected) throw new Error("Please choose a book");
                  const newStock = (selected.stock || 0) + parseInt(restockQty);
                  const res = await fetch(
                    getApiUrl(`api/books/${selected.id}`),
                    {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        title: selected.title,
                        description: selected.description,
                        price: selected.price,
                        stock: newStock,
                        author_id: selected.author_id,
                        category_id: selected.category_id,
                        book_img: selected.book_img,
                        published_date: selected.published_date,
                      }),
                    },
                  );
                  const data = await res.json();
                  if (res.ok && data.status === "success") {
                    setShowRestock(false);
                    setRestockBook("");
                    setRestockQty(0);
                    fetchBooks();
                  } else {
                    setRestockError(data.message || "Failed to restock");
                  }
                } catch (err) {
                  setRestockError(err.message);
                } finally {
                  setRestockLoading(false);
                }
              }}
              className="px-6 py-4 space-y-4"
            >
              {restockError && (
                <p className="text-red-600 text-sm">{restockError}</p>
              )}
              <div>
                <label className="block text-sm font-bold mb-1">Book</label>
                <select
                  required
                  value={restockBook}
                  onChange={(e) => setRestockBook(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">-- select --</option>
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title} (Stock: {b.stock || 0})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Quantity</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={restockQty}
                  onChange={(e) => setRestockQty(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowRestock(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                  disabled={restockLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1a1209] text-white rounded"
                  disabled={restockLoading}
                >
                  {restockLoading ? "Processing..." : "Restock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
