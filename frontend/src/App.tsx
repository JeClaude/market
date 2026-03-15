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

function App() {
  // ✅ State to control cart modal
  const [cartOpen, setCartOpen] = useState(false);

  // ✅ Cart items shared state
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'A25 Portable Bluetooth Speaker', price: 12000, quantity: 2, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200', category: 'Electronics' },
    { id: 2, name: "Men's Graphic Wave T-Shirt", price: 14000, quantity: 1, image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=200', category: 'Clothing' },
    { id: 3, name: 'Wireless Headphones Pro', price: 45000, quantity: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200', category: 'Electronics' },
  ]);

  // ✅ Auth state reactive
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  // ✅ Listen to storage changes (login/logout in another tab or component)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <ScrollToTop behavior="smooth" delay={100} offset={80} />

      <div className="min-h-screen flex flex-col">
        {/* Navbar receives cart state */}
        <Navbar
          openCart={() => setCartOpen(true)}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          cartItems={cartItems}          // ✅ pass cartItems
        />

        {/* Cart modal receives cart state & updater */}
        <Cart
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          cartItems={cartItems}          // ✅ current cart
          setCartItems={setCartItems}    // ✅ updater
        />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
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