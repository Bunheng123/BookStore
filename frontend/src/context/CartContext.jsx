import { createContext, useContext, useState, useEffect } from "react";
import { getApiUrl } from "../apiConfig";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("folio_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    localStorage.setItem("folio_cart", JSON.stringify(cart));
  }, [cart]);

  const addNotification = (message, type = "success") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  const addToCart = (book, quantity) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === book.id);
      if (existing) {
        return prev.map((item) =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { ...book, quantity }];
    });
    addNotification(`"${book.title}" added to cart!`);
  };

  const removeFromCart = (bookId) => {
    setCart((prev) => prev.filter((item) => item.id !== bookId));
  };

  const updateQuantity = (bookId, quantity) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) => (item.id === bookId ? { ...item, quantity } : item)),
    );
  };

  const clearCart = () => setCart([]);

  const checkout = async () => {
    try {
      // Get customer from localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const customerId = user.id;

      if (!customerId) {
        addNotification("Please log in to proceed with checkout", "error");
        return false;
      }

      if (cart.length === 0) {
        addNotification("Your cart is empty", "error");
        return false;
      }

      // Calculate total
      const totalAmount = cart.reduce(
        (sum, item) => sum + parseFloat(item.price) * item.quantity,
        0,
      );

      // Prepare order data
      const orderData = {
        customer_id: customerId,
        total_amount: totalAmount,
        items: cart.map((item) => ({
          book_id: item.id,
          quantity: item.quantity,
          price: parseFloat(item.price),
        })),
      };

      // Send order to backend
      const response = await fetch(getApiUrl("api/orders"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        addNotification("Order placed successfully!", "success");
        clearCart();
        return true;
      } else {
        addNotification(result.message || "Checkout failed", "error");
        return false;
      }
    } catch (error) {
      addNotification(`Checkout error: ${error.message}`, "error");
      return false;
    }
  };

  const totalItems = cart.length;
  const totalPrice = cart.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        notifications,
        addNotification,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
