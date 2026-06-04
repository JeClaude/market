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
import Admin from './pages/Admin';
import AdminRoute from './components/AdminRoute';

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const token = localStorage.getItem("token");

  // --- Load cart on app start ---
  useEffect(() => {
    const loadCart = async () => {
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

      if (token) {
        try {
          const res = await axios.get("http://localhost:5000/api/cart", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const serverCart = (res.data.items || [])
            .filter((item: any) => item && item.product)
            .map((item: any) => ({
              id: item.product._id,
              name: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
              image: item.product.image,
              category: item.product.category || "",
            }));
          setCartItems(serverCart);
        } catch (err: any) {
          const status = err?.response?.status;
          if (status === 401 || status === 403) {
            console.warn("Server cart request unauthorized, falling back to local cart.");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("role");
            setIsLoggedIn(false);
            setCartItems(localCart);
          } else {
            console.error("Error loading server cart:", err);
          }
        }
      } else {
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
            <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/categories" element={<CategoryExplorer />} />
            <Route
              path="/admin"
              element={
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                }
              />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;