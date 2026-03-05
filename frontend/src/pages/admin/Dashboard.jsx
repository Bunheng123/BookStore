import { useState, useEffect } from "react";
import { API_BASE_URL, getApiUrl } from "../../apiConfig";
import AdminHeader from "../../components/AdminHeader";
const ESPRESSO = "#1a1209";
const GOLD = "#d4af5f";
const PARCHMENT = "#f5f0e8";
const BROWN_MID = "#8a7560";

const MOCK_STATS = [
  { label: "Active Orders", value: "12", icon: "📦", trend: "+2 this week" },
  { label: "Total Customers", value: "154", icon: "👥", trend: "+12% growth" },
  {
    label: "Monthly Revenue",
    value: "$4,250",
    icon: "💰",
    trend: "+8.5% vs last month",
  },
];

const RECENT_ACTIVITY = [
  {
    id: 1,
    type: "order",
    text: "New order #1245 by Emma Watson",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "inventory",
    text: "Restocked 'The Great Gatsby' (5 copies)",
    time: "5 hours ago",
  },
  {
    id: 3,
    type: "customer",
    text: "New customer registration: Alan Turing",
    time: "Yesterday",
  },
  {
    id: 4,
    type: "order",
    text: "Order #1240 shipped to Jane Doe",
    time: "1 day ago",
  },
];

export default function Dashboard() {
  const [bookCount, setBookCount] = useState(0);
  const [booksList, setBooksList] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lowStockBooks, setLowStockBooks] = useState([]);
  const [showLowStockList, setShowLowStockList] = useState(true);

  // restock modal state
  const [showRestock, setShowRestock] = useState(false);
  const [restockBook, setRestockBook] = useState("");
  const [restockQty, setRestockQty] = useState(0);
  const [restockError, setRestockError] = useState("");
  const [restockLoading, setRestockLoading] = useState(false);

  // helper to load books and low-stock info
  const refreshBooks = async () => {
    try {
      const res = await fetch(getApiUrl("api/books"));
      const data = await res.json();
      if (data.status === "success") {
        setBookCount(data.data.length);
        setBooksList(data.data);
        const lowStock = data.data.filter((b) => (b.stock || 0) <= 5);
        setLowStockBooks(lowStock);
      }
    } catch (err) {
      console.error("Could not fetch books for dashboard:", err);
    }
  };

  useEffect(() => {
    // load initial data
    refreshBooks();

    // fetch orders and compute count & revenue
    fetch(getApiUrl("api/orders"))
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          const orders = data.data;
          setOrderCount(orders.length);
          const totalRev = orders.reduce(
            (sum, o) => sum + parseFloat(o.total_amount || 0),
            0,
          );
          setRevenue(totalRev);
        }
      })
      .catch((err) =>
        console.error("Could not fetch orders for dashboard:", err),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 space-y-8">
      {/* Header with date and new button on right */}
      <AdminHeader
        title="Admin Dashboard"
        description="Welcome back. Here's what's happening in your bookstore today."
        rightContent={
          <div className="flex gap-3">
            <button
              disabled
              className="px-4 py-2 text-sm bg-[#f5f0e8] border border-[#e5ddd0] rounded whitespace-nowrap"
            >
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </button>
            <button
              onClick={() => setShowRestock(true)}
              className="px-4 py-2 text-sm bg-[#1a1209] text-[#f5f0e8] border border-[#1a1209] rounded hover:bg-[#d4af5f] hover:text-[#1a1209] transition-all duration-300 whitespace-nowrap"
            >
              Restock
            </button>
          </div>
        }
      />

      {/* Stats Grid - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Books */}
        <div className="bg-[#f5f0e8] p-6 shadow-sm border border-[#c8b99a] transition-transform duration-300 hover:-translate-y-1 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <span className="text-3xl">📚</span>
            <span className="text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-[#d4af5f] text-[#1a1209] rounded font-bold">
              Inventory
            </span>
          </div>
          <p className="text-4xl font-bold text-[#1a1209] mb-1">
            {loading ? "..." : bookCount}
          </p>
          <p className="text-[0.65rem] tracking-wider uppercase mb-2 text-[#8a7560] font-semibold">
            Total Books
          </p>
          <div className="h-px w-full bg-[#c8b99a] mb-2" />
          <p className="text-[0.6rem] italic text-[#8a7560]">
            Across all genres
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-[#f5f0e8] p-6 shadow-sm border border-[#c8b99a] transition-transform duration-300 hover:-translate-y-1 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <span className="text-3xl">📦</span>
            <span className="text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-[#d4af5f] text-[#1a1209] rounded font-bold">
              Orders
            </span>
          </div>
          <p className="text-4xl font-bold text-[#1a1209] mb-1">
            {loading ? "..." : orderCount}
          </p>
          <p className="text-[0.65rem] tracking-wider uppercase mb-2 text-[#8a7560] font-semibold">
            Total Orders
          </p>
          <div className="h-px w-full bg-[#c8b99a] mb-2" />
          <p className="text-[0.6rem] italic text-[#8a7560]">
            Revenue: ${revenue.toFixed(2)}
          </p>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-[#f5f0e8] p-6 shadow-sm border border-[#c8b99a] transition-transform duration-300 hover:-translate-y-1 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <span className="text-3xl">⚠️</span>
            <span className="text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-[#d4af5f] text-[#1a1209] rounded font-bold">
              Alert
            </span>
          </div>
          <p className="text-4xl font-bold text-[#1a1209] mb-1">
            {loading ? "..." : lowStockBooks.length}
          </p>
          <p className="text-[0.65rem] tracking-wider uppercase mb-2 text-[#8a7560] font-semibold">
            Low Stock Items
          </p>
          <div className="h-px w-full bg-[#c8b99a] mb-2" />
          <p className="text-[0.6rem] italic text-[#8a7560]">
            {lowStockBooks.length > 0 ? "Action needed" : "All good!"}
          </p>
        </div>

        {/* Sales Health */}
        <div className="bg-[#f5f0e8] p-6 shadow-sm border border-[#c8b99a] transition-transform duration-300 hover:-translate-y-1 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <span className="text-3xl">💹</span>
            <span className="text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-[#d4af5f] text-[#1a1209] rounded font-bold">
              Sales
            </span>
          </div>
          <p className="text-4xl font-bold text-[#1a1209] mb-1">↑ 12%</p>
          <p className="text-[0.65rem] tracking-wider uppercase mb-2 text-[#8a7560] font-semibold">
            Monthly Growth
          </p>
          <div className="h-px w-full bg-[#c8b99a] mb-2" />
          <p className="text-[0.6rem] italic text-[#8a7560]">vs. last month</p>
        </div>
      </div>

      {/* Low Stock Alert Banner */}
      {lowStockBooks.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-800 font-semibold mb-2">🚨 Low Stock Alert!</p>
          <div className="flex flex-wrap gap-2">
            {lowStockBooks.slice(0, 5).map((book) => (
              <span
                key={book.id}
                className="text-xs bg-red-200 text-red-900 px-2 py-1 rounded font-semibold"
              >
                {book.title} ({book.stock || 0})
              </span>
            ))}
            {lowStockBooks.length > 5 && (
              <span className="text-xs text-red-700 font-semibold">
                +{lowStockBooks.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Stats Grid - Original (removed, replaced above) */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white p-8 shadow-sm border border-[#e5ddd0]">
          <h2
            className="text-xl font-normal mb-8"
            style={{ color: ESPRESSO, fontFamily: "Georgia, serif" }}
          >
            Recent Activity
          </h2>
          <div className="space-y-6">
            {RECENT_ACTIVITY.map((act) => (
              <div key={act.id} className="flex gap-4 items-start group">
                <div
                  className="w-1.5 h-1.5 rounded-full mt-2"
                  style={{ background: GOLD }}
                />
                <div className="flex-1">
                  <p
                    className="text-sm leading-snug mb-1"
                    style={{ color: ESPRESSO }}
                  >
                    {act.text}
                  </p>
                  <p
                    className="text-[0.65rem] italic"
                    style={{ color: BROWN_MID }}
                  >
                    {act.time}
                  </p>
                </div>
                <button className="text-[0.6rem] tracking-widest uppercase text-transparent group-hover:text-gold transition-colors duration-200">
                  Details
                </button>
              </div>
            ))}
          </div>
          <button
            className="mt-10 text-[0.65rem] tracking-[0.25em] uppercase w-full py-4 border transition-all duration-300 hover:bg-[#1a1209] hover:text-[#f5f0e8]"
            style={{ color: ESPRESSO, borderColor: "#c8b99a" }}
          >
            View All Activity
          </button>
        </div>

        {/* Low Stock Products */}
        <div className="space-y-6">
          <div className="bg-[#f5f0e8] p-8 border border-[#c8b99a]">
            <h2
              className="text-lg font-semibold mb-4"
              style={{ color: ESPRESSO, fontFamily: "Georgia, serif" }}
            >
              Low Stock Products ({lowStockBooks.length})
            </h2>
            {showLowStockList &&
              (lowStockBooks.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {lowStockBooks.map((book) => (
                    <div
                      key={book.id}
                      className="flex items-center justify-between bg-white p-3 border border-[#e5ddd0] rounded hover:shadow-sm transition-shadow"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#1a1209]">
                          {book.title}
                        </p>
                        <p className="text-xs" style={{ color: BROWN_MID }}>
                          Stock: {book.stock || 0} units
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#8a7560] italic">
                  All products are well stocked!
                </p>
              ))}
            <button
              onClick={() => setShowLowStockList((s) => !s)}
              className="w-full mt-4 px-4 py-2 bg-[#1a1209] text-[#f5f0e8] text-xs tracking-widest uppercase hover:bg-[#d4af5f] hover:text-[#1a1209] transition-all duration-300"
            >
              {showLowStockList ? "Hide List" : "Show Alert List"}
            </button>
          </div>

          {/* System Status Card */}

          {/* restock modal setup */}
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
                      const selected = booksList.find(
                        (b) => b.id === parseInt(restockBook),
                      );
                      if (!selected) throw new Error("Please choose a book");
                      const newStock =
                        (selected.stock || 0) + parseInt(restockQty);
                      const res = await fetch(
                        getApiUrl(`api/books/${selected.id}`),
                        {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            // backend expects full book payload, so include all fields
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
                      let data;
                      try {
                        data = await res.json();
                      } catch (parseErr) {
                        const text = await res.text();
                        console.error("Restock response not JSON:", text);
                        throw new Error("Server error: " + text);
                      }
                      if (res.ok && data.status === "success") {
                        setShowRestock(false);
                        // refresh books list + low stock
                        await refreshBooks();
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
                      {booksList.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">
                      Quantity
                    </label>
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
          <div className="bg-[#f5f0e8] p-8 border border-[#c8b99a]">
            <p
              className="text-[0.6rem] tracking-[0.3em] uppercase mb-4"
              style={{ color: GOLD }}
            >
              System Status
            </p>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-xs font-semibold" style={{ color: ESPRESSO }}>
                API Server Online
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[0.65rem]">
                <span style={{ color: BROWN_MID }}>DB Connection</span>
                <span className="text-green-600 font-bold">Stable</span>
              </div>
              <div className="flex justify-between text-[0.65rem]">
                <span style={{ color: BROWN_MID }}>Storage Usage</span>
                <span style={{ color: ESPRESSO }}>24%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
