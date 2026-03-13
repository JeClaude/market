import { useState } from 'react';
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

function App() {
  // ✅ State to control cart modal
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <Router>
      <ScrollToTop 
        behavior="smooth" 
        delay={100} 
        offset={80} 
      />

      <div className="min-h-screen flex flex-col">
        {/* Navbar receives a function to open the cart */}
        <Navbar openCart={() => setCartOpen(true)} />

        {/* Cart modal */}
        <Cart
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
        />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
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