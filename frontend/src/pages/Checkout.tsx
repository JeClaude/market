import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config";

const CART_API = `${API_URL}/api/cart`;

const COUNTRY_CODES = [
  { code: "+250", country: "+250", name: "Rwanda" },
];

const Checkout = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+250");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

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

    axios
      .get(CART_API, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const data = res.data;
        const items = (data.items || [])
          .filter((i: any) => i && i.product)
          .map((i: any) => ({
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

    if (!fullName || !email || !phone || !address || !city || !province || !postalCode) {
      alert("Please fill in all required fields");
      return;
    }

    if (paymentMethod === "Mobile Money") {
      alert("Please use the Mobile Money payment button below to proceed");
      return;
    }

    setLoading(true);
    const fullPhone = `${countryCode} ${phone}`;
    const order = {
      customer: {
        fullName,
        email,
        phone: fullPhone,
        address,
        city,
        province,
        postalCode,
        deliveryNotes,
      },
      paymentMethod,
      items: cartItems,
      subtotal,
      shipping,
      tax,
      total,
      status: "pending",
      createdAt: new Date(),
    };

    console.log("Order placed:", order);
    alert("Order placed successfully! We'll contact you soon.");
    setLoading(false);
    navigate("/");
  };

  const handleMobileMoneyPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileMoneyNumber || mobileMoneyNumber.length < 10) {
      alert("Please enter a valid mobile money number");
      return;
    }

    setPaymentProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const fullPhone = `${countryCode} ${phone}`;
      const fullMobileMoneyNumber = `${countryCode} ${mobileMoneyNumber}`;
      const order = {
        customer: {
          fullName,
          email,
          phone: fullPhone,
          address,
          city,
          province,
          postalCode,
          deliveryNotes,
        },
        paymentMethod: "Mobile Money",
        mobileMoneyNumber: fullMobileMoneyNumber,
        items: cartItems,
        subtotal,
        shipping,
        tax,
        total,
        status: "paid",
        createdAt: new Date(),
      };

      console.log("Mobile Money Order placed:", order);
      alert(`Payment of ${total.toLocaleString()} RWF initiated from ${fullMobileMoneyNumber}. Check your phone for confirmation.`);
      setPaymentProcessing(false);
      navigate("/");
    }, 1500);
  };

  const handleCardPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardNumber || cardNumber.replace(/\s/g, "").length < 13) {
      alert("Please enter a valid card number");
      return;
    }
    if (!cardHolder) {
      alert("Please enter cardholder name");
      return;
    }
    if (!expiryDate || expiryDate.length < 5) {
      alert("Please enter valid expiry date (MM/YY)");
      return;
    }
    if (!cvv || cvv.length < 3) {
      alert("Please enter valid CVV");
      return;
    }

    setPaymentProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const fullPhone = `${countryCode} ${phone}`;
      const order = {
        customer: {
          fullName,
          email,
          phone: fullPhone,
          address,
          city,
          province,
          postalCode,
          deliveryNotes,
        },
        paymentMethod: "Credit Card",
        cardLast4: cardNumber.slice(-4),
        items: cartItems,
        subtotal,
        shipping,
        tax,
        total,
        status: "paid",
        createdAt: new Date(),
      };

      console.log("Card Payment Order placed:", order);
      alert(`Payment of ${total.toLocaleString()} RWF successfully processed on card ending in ${cardNumber.slice(-4)}.`);
      setPaymentProcessing(false);
      setCardNumber("");
      setCardHolder("");
      setExpiryDate("");
      setCvv("");
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-16 mt-20">
      <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">Checkout</h1>
      <p className="text-center text-gray-600 mb-8">Complete your delivery information</p>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* Delivery Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2">
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200 mb-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <span className="text-2xl">👤</span> Personal Information
            </h2>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <label className="block">
                <span className="text-gray-700 font-semibold block mb-2">Full Name *</span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  placeholder="John Doe"
                />
              </label>
              <label className="block">
                <span className="text-gray-700 font-semibold block mb-2">Email *</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  placeholder="john@example.com"
                />
              </label>
            </div>

            <label className="block mb-4">
              <span className="text-gray-700 font-semibold block mb-2">Phone Number *</span>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                >
                  {COUNTRY_CODES.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.country}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  required
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  placeholder="788 123 456"
                />
              </div>
            </label>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200 mb-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <span className="text-2xl">📍</span> Delivery Address
            </h2>

            <label className="block mb-4">
              <span className="text-gray-700 font-semibold block mb-2">Street Address *</span>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition resize-none"
                placeholder="123 Main Street, Apt 4B"
              />
            </label>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <label className="block">
                <span className="text-gray-700 font-semibold block mb-2">City *</span>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  placeholder="Kigali"
                />
              </label>
              <label className="block">
                <span className="text-gray-700 font-semibold block mb-2">Province *</span>
                <input
                  type="text"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  placeholder="Kigali City"
                />
              </label>
              <label className="block">
                <span className="text-gray-700 font-semibold block mb-2">Postal Code *</span>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  placeholder="RW000"
                />
              </label>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200 mb-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <span className="text-2xl">📝</span> Additional Info
            </h2>

            <label className="block mb-4">
              <span className="text-gray-700 font-semibold block mb-2">Delivery Notes (Optional)</span>
              <textarea
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition resize-none"
                placeholder="e.g., Leave at door, call before delivery, etc."
              />
            </label>

            <label className="block">
              <span className="text-gray-700 font-semibold block mb-2">Payment Method *</span>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              >
                <option value="Cash on Delivery">💵 Cash on Delivery</option>
                <option value="Mobile Money">📱 Mobile Money (MoMo)</option>
                <option value="Credit Card">💳 Credit Card</option>
              </select>
            </label>

            {paymentMethod === "Mobile Money" && (
              <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">📱 Mobile Money Payment</h3>
                <form onSubmit={handleMobileMoneyPayment} className="space-y-4">
                  <div>
                    <label className="text-gray-700 font-semibold block mb-2">Mobile Money Number *</label>
                    <div className="flex gap-2 items-center">
                      <span className="px-3 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-semibold whitespace-nowrap">+250</span>
                      <input
                        type="tel"
                        value={mobileMoneyNumber}
                        onChange={(e) => setMobileMoneyNumber(e.target.value.replace(/\D/g, ""))}
                        required={paymentMethod === "Mobile Money"}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                        placeholder="788 123 456"
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Enter your MTN or Airtel number</p>
                  </div>

                  <div className="bg-blue-100 p-3 rounded-lg border border-blue-200">
                    <p className="text-sm font-semibold text-blue-900">Amount to pay:</p>
                    <p className="text-2xl font-bold text-blue-700">{total.toLocaleString()} RWF</p>
                  </div>

                  <button
                    type="submit"
                    disabled={paymentProcessing}
                    className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                  >
                    {paymentProcessing ? "Processing Payment..." : "Pay Now"}
                  </button>
                </form>
              </div>
            )}

            {paymentMethod === "Credit Card" && (
              <div className="mt-6 p-4 bg-purple-50 border-2 border-purple-300 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-4">💳 Credit Card Payment</h3>
                <form onSubmit={handleCardPayment} className="space-y-4">
                  <div>
                    <label className="text-gray-700 font-semibold block mb-2">Card Number *</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim())}
                      required={paymentMethod === "Credit Card"}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                    <p className="text-sm text-gray-600 mt-2">Enter your 16-digit card number</p>
                  </div>

                  <div>
                    <label className="text-gray-700 font-semibold block mb-2">Cardholder Name *</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                      required={paymentMethod === "Credit Card"}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                      placeholder="JOHN DOE"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-700 font-semibold block mb-2">Expiry Date *</label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "");
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + "/" + value.slice(2, 4);
                          }
                          setExpiryDate(value);
                        }}
                        required={paymentMethod === "Credit Card"}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="text-gray-700 font-semibold block mb-2">CVV *</label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                        required={paymentMethod === "Credit Card"}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <div className="bg-purple-100 p-3 rounded-lg border border-purple-200">
                    <p className="text-sm font-semibold text-purple-900">Amount to pay:</p>
                    <p className="text-2xl font-bold text-purple-700">{total.toLocaleString()} RWF</p>
                  </div>

                  <button
                    type="submit"
                    disabled={paymentProcessing}
                    className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50"
                  >
                    {paymentProcessing ? "Processing Payment..." : "Pay Now"}
                  </button>
                </form>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || (paymentMethod !== "Cash on Delivery")}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? "Processing..." : paymentMethod !== "Cash on Delivery" ? paymentMethod + " - Use Payment Form Below" : "Place Order"}
          </button>

          <Link
            to="/cart"
            className="block mt-4 text-center text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Back to Cart
          </Link>
        </form>

        {/* Order Summary Sticky */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-200 sticky top-24">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <span className="text-2xl">📦</span> Order Summary
            </h2>

            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="mb-6 max-h-64 overflow-y-auto space-y-3 border-b pb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-800">{(item.price * item.quantity).toLocaleString()} RWF</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between pb-2 border-b">
                    <span>Subtotal</span>
                    <span className="font-semibold">{subtotal.toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 font-semibold" : "font-semibold"}>
                      {shipping === 0 ? "Free" : `${shipping.toLocaleString()} RWF`}
                    </span>
                  </div>
                  <div className="flex justify-between pb-3 border-b">
                    <span>Tax (18%)</span>
                    <span className="font-semibold">{tax.toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between bg-blue-50 p-3 rounded-lg">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-lg text-blue-600">{total.toLocaleString()} RWF</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;