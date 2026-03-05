import { useState, useEffect } from "react";
import { getApiUrl } from "../../apiConfig";
import AdminHeader from "../../components/AdminHeader";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl("api/orders"));
      const data = await res.json();
      if (data.status === "success") {
        setOrders(data.data);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async (orderId) => {
    try {
      const res = await fetch(getApiUrl(`api/orders/${orderId}/items`));
      const data = await res.json();
      if (data.status === "success") {
        setSelectedItems(data.data);
      }
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    try {
      const res = await fetch(getApiUrl(`api/orders/${orderId}/status`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        // Update local state
        setOrders(
          orders.map((o) =>
            o.id === orderId ? { ...o, status: newStatus } : o,
          ),
        );
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Error updating status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <AdminHeader
        title="Manage Orders"
        description="Review orders and update their status."
      />

      <div className="bg-white border border-[#e5ddd0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f5f0e8] border-b border-[#e5ddd0]">
                <th className="px-6 py-4 text-[0.65rem] tracking-[0.2em] uppercase text-[#8a7560] font-bold">
                  Order #
                </th>
                <th className="px-6 py-4 text-[0.65rem] tracking-[0.2em] uppercase text-[#8a7560] font-bold">
                  Total
                </th>
                <th className="px-6 py-4 text-[0.65rem] tracking-[0.2em] uppercase text-[#8a7560] font-bold">
                  Status
                </th>
                <th className="px-6 py-4 text-[0.65rem] tracking-[0.2em] uppercase text-[#8a7560] font-bold">
                  Date
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
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center italic text-gray-400"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr
                    key={o.id}
                    className="hover:bg-[#fdfaf5] transition-colors group"
                  >
                    <td className="px-6 py-4">{o.id}</td>
                    <td className="px-6 py-4">
                      ${parseFloat(o.total).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={o.status}
                        onChange={(e) =>
                          updateOrderStatus(o.id, e.target.value)
                        }
                        disabled={updatingStatus === o.id}
                        className="px-3 py-2 border border-[#c8b99a] rounded text-sm bg-white text-[#1a1209] hover:border-[#d4af5f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <option value="pending">Pending</option>
                        <option value="arrived">Arrived</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(o.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => fetchItems(o.id)}
                        className="px-3 py-1.5 bg-[#f5f0e8] text-[0.65rem] tracking-widest uppercase text-[#1a1209] hover:bg-[#d4af5f] transition-all duration-200 border border-[#e5ddd0] hover:border-[#d4af5f] shadow-sm"
                      >
                        View Items
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Items modal */}
      {selectedItems && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg shadow-2xl overflow-hidden border border-[#d4af5f]">
            <div className="bg-[#1a1209] px-8 py-6 flex justify-between items-center">
              <h2
                className="text-[#f5f0e8] text-xl font-normal italic"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Order Items
              </h2>
              <button
                onClick={() => setSelectedItems(null)}
                className="text-[#d4af5f] hover:text-[#f5f0e8] transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#f5f0e8]">
                    <th className="px-4 py-2 text-xs">Book</th>
                    <th className="px-4 py-2 text-xs">Qty</th>
                    <th className="px-4 py-2 text-xs">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedItems.map((i, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="px-4 py-2">
                        {i.book_title || `ID:${i.book_id}`}
                      </td>
                      <td className="px-4 py-2">{i.quantity}</td>
                      <td className="px-4 py-2">
                        ${parseFloat(i.unit_price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
