import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './pages/Navbar';
import Footer from './pages/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import CategoryExplorer from './pages/CategoryExplorer';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import axios from 'axios';

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const token = localStorage.getItem("token");

  // --- Load cart on app start ---
  useEffect(() => {
    const loadCart = async () => {
      if (token) {
        try {
          const res = await axios.get("http://localhost:5000/api/cart", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const serverCart = res.data.items.map((item: any) => ({
            id: item.product._id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.image,
            category: item.product.category || "",
          }));
          setCartItems(serverCart);
        } catch (err) {
          console.error("Error loading server cart:", err);
        }
      } else {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems(localCart);
      }
    };
    loadCart();
  }, [isLoggedIn, token]);

  // --- Listen to storage changes across tabs ---
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
      if (!localStorage.getItem("token")) setCartItems(localCart);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <ScrollToTop behavior="smooth" delay={100} offset={80} />

      <div className="min-h-screen flex flex-col">
        <Navbar
          openCart={() => setCartOpen(true)}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          cartItems={cartItems}
        />

        <Cart
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          cartItems={cartItems}
          setCartItems={setCartItems}
        />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products cartItems={cartItems} setCartItems={setCartItems} />} />
            <Route path="/product/:id" element={<ProductDetail cartItems={cartItems} setCartItems={setCartItems} />} />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/categories" element={<CategoryExplorer />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;