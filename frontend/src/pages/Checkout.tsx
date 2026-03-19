import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "https://market-9whr.vercel.app/api/cart";

const Checkout = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must log in to access checkout");
      navigate("/login");
    }
  }, [navigate]);

  // Load cart items
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const items = data.items.map((i: any) => ({
          id: i.product._id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
        }));
        setCartItems(items);
      })
      .catch((err) => console.error("Failed to load cart", err));
  }, []);

  // Calculate totals
  useEffect(() => {
    const sub = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const ship = sub > 50000 ? 0 : 5000;
    const t = sub * 0.18;
    setSubtotal(sub);
    setShipping(ship);
    setTax(t);
    setTotal(sub + ship + t);
  }, [cartItems]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const order = {
      customer: { fullName, phone, address },
      paymentMethod,
      items: cartItems,
      subtotal,
      shipping,
      tax,
      total,
      createdAt: new Date(),
    };

    console.log("Order placed:", order);
    alert("Order placed successfully!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-16 mt-20">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Checkout</h1>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Customer Info */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg border border-gray-200"
        >
          <h2 className="text-xl font-semibold mb-6 text-gray-700">Your Information</h2>

          <label className="block mb-4">
            <span className="text-gray-600 font-medium">Full Name</span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="John Doe"
            />
          </label>

          <label className="block mb-4">
            <span className="text-gray-600 font-medium">Phone Number</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="+250 788 123 456"
            />
          </label>

          <label className="block mb-4">
            <span className="text-gray-600 font-medium">Delivery Address</span>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={4}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Kigali, Rwanda"
            />
          </label>

          <label className="block mb-6">
            <span className="text-gray-600 font-medium">Payment Method</span>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option>Cash on Delivery</option>
              <option>Mobile Money (MoMo)</option>
              <option>Credit Card</option>
            </select>
          </label>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
          >
            Place Order
          </button>

          <Link
            to="/cart"
            className="block mt-4 text-center text-blue-600 hover:underline font-medium"
          >
            ← Back to Cart
          </Link>
        </form>

        {/* Order Summary */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-6 text-gray-700">Order Summary</h2>

          {cartItems.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <>
              <ul className="mb-6 space-y-3 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex justify-between items-center">
                    <span className="text-gray-700">{item.name} x {item.quantity}</span>
                    <span className="font-semibold text-gray-800">{(item.price * item.quantity).toLocaleString()} RWF</span>
                  </li>
                ))}
              </ul>

              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{subtotal.toLocaleString()} RWF</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-semibold">Free</span>
                  ) : (
                    <span>{shipping.toLocaleString()} RWF</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span>Tax (18%)</span>
                  <span>{tax.toLocaleString()} RWF</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-gray-800 text-lg">
                  <span>Total</span>
                  <span>{total.toLocaleString()} RWF</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;