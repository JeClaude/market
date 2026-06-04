import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from "../config";

const CART_API = `${API_URL}/api/cart`;

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
};

type CartProps = {
  isOpen?: boolean;
  onClose?: () => void;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
};

const Cart: React.FC<CartProps> = ({ isOpen, onClose, cartItems, setCartItems }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isDrawer = typeof isOpen === "boolean";
  const visible = isDrawer ? isOpen : true;
  const closeCart = onClose || (() => {});
  const isPage = !isDrawer;

  // --- Sync cart changes for logged-in users ---
  useEffect(() => {
    if (!token) return;
    const syncCart = async () => {
      try {
        for (const item of cartItems) {
          await axios.put(
            `${CART_API}/${item.id}`,
            { quantity: item.quantity },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      } catch (err) {
        console.error("Error syncing cart with server:", err);
      }
    };
    syncCart();
  }, [cartItems, token]);

  // --- Update quantity ---
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );

    // Guest localStorage
    if (!token) {
      const updatedCart = cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  // --- Remove item ---
  const removeItem = (id: string) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);

    if (!token) localStorage.setItem("cart", JSON.stringify(updated));
    else {
      axios.delete(`${CART_API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(err => console.error("Error deleting item from server cart:", err));
    }
  };

  // --- Totals ---
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50000 ? 0 : 5000;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  if (!visible) return null;

  const panelClass = isPage
    ? "min-h-screen w-full bg-white overflow-hidden flex flex-col"
    : "fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 overflow-hidden flex flex-col";

  return (
    <>
      {isDrawer && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={closeCart}
              className="fixed inset-0 bg-black z-40"
            />
          )}
        </AnimatePresence>
      )}

      {isDrawer ? (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className={panelClass}
            >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🛒</span>
                  <h2 className="text-xl font-bold">Your Cart</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      closeCart();
                      navigate("/cart");
                    }}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    title="View full cart"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                  <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-sm opacity-90 mt-1">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">🛒</span>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6">Looks like you haven't added anything yet</p>
                  <Link
                    to="/products"
                    onClick={onClose}
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                cartItems.map(item => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    className="flex gap-3 bg-gray-50 rounded-lg p-3 relative group"
                  >
                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm mb-1 line-clamp-2">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 hover:bg-gray-200 rounded-l-lg transition-colors"
                          >-</button>
                          <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 hover:bg-gray-200 rounded-r-lg transition-colors"
                          >+</button>
                        </div>
                        <span className="font-bold text-blue-600">{(item.price * item.quantity).toLocaleString()} RWF</span>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <h3 className="font-semibold mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{subtotal.toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    {shipping === 0 ? <span className="text-green-600">Free</span> : <span>{shipping.toLocaleString()} RWF</span>}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (18% VAT)</span>
                    <span>{tax.toLocaleString()} RWF</span>
                  </div>
                  <div className="border-t border-gray-300 my-2 pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-blue-600">{total.toLocaleString()} RWF</span>
                    </div>
                  </div>
                </div>
                <Link to="/checkout" onClick={onClose}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Proceed to Checkout
                  </motion.button>
                </Link>
                <button
                  onClick={onClose}
                  className="w-full mt-2 py-2 text-gray-600 hover:text-gray-800 text-sm transition-colors"
                >
                  ← Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      ) : (
        <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
          <div className="max-w-6xl mx-auto bg-white shadow rounded-3xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">Shopping Cart</h1>
                  <p className="text-sm opacity-90 mt-1">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
                </div>
                <Link to="/products" className="inline-block px-5 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-white/90 transition">
                  Continue Shopping
                </Link>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-16">
                  <span className="text-6xl mb-4 block">🛒</span>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6">Add products to your cart and they will appear here.</p>
                  <Link to="/products" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Shop now
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2 space-y-4">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex gap-4 bg-gray-50 rounded-3xl p-4">
                        <div className="w-28 h-28 bg-gray-200 rounded-3xl overflow-hidden flex-shrink-0">
                          <img src={item.image || undefined} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-500 mb-3">{item.category}</p>
                          <div className="flex items-center gap-3 mb-3">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-10 h-10 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition">-</button>
                            <span className="min-w-[40px] text-center text-base font-medium">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-10 h-10 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition">+</button>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Price: {item.price.toLocaleString()} RWF</span>
                            <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">Remove</button>
                          </div>
                        </div>
                        <div className="flex items-end text-right">
                          <div>
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="text-lg font-semibold text-blue-600">{(item.price * item.quantity).toLocaleString()} RWF</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                    <div className="space-y-3 text-gray-700 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{subtotal.toLocaleString()} RWF</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>{shipping === 0 ? 'Free' : `${shipping.toLocaleString()} RWF`}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (18%)</span>
                        <span>{tax.toLocaleString()} RWF</span>
                      </div>
                      <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>{total.toLocaleString()} RWF</span>
                      </div>
                    </div>
                    <Link to="/checkout" className="block mt-6">
                      <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition">
                        Proceed to Checkout
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;