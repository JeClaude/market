import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Cart from './Cart';
import { FiMenu, FiShoppingCart, FiSearch } from 'react-icons/fi';

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' 
            : 'bg-white/80 backdrop-blur-sm py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Desktop Layout */}
          <div className="hidden md:flex justify-between items-center">
            <Link to="/" className="text-xl font-semibold text-gray-900">
              Ability Traders
            </Link>
            
            <div className="flex space-x-6 items-center">
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link to="/categories" className="text-gray-600 hover:text-blue-600 transition-colors">
                Categories
              </Link>
              <Link to="/products" className="text-gray-600 hover:text-blue-600 transition-colors">
                Products
              </Link>
              
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 focus:outline-none"
              >
                <FiShoppingCart className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              
              <Link 
                to="/login" 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Mobile Layout - Two Layers */}
          <div className="md:hidden">
            {/* First Layer - Logo and Icons */}
            <div className="flex justify-between items-center">
              <Link to="/" className="text-xl font-bold text-gray-900">
                Ability Traders
              </Link>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-1 text-gray-700"
                  aria-label="Cart"
                >
                  <FiShoppingCart className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>

                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-1 text-gray-700"
                  aria-label="Menu"
                >
                  <FiMenu className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Second Layer - Search Bar */}
            <div className="mt-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for anything"
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-sm"
                />
                <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden bg-white ${
          isMobileMenuOpen ? 'max-h-64 mt-2' : 'max-h-0'
        }`}>
          <div className="px-4 py-3 space-y-3">
            <Link 
              to="/" 
              className="block py-2 text-gray-700 hover:text-blue-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/categories" 
              className="block py-2 text-gray-700 hover:text-blue-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Categories
            </Link>
            <Link 
              to="/products" 
              className="block py-2 text-gray-700 hover:text-blue-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Products
            </Link>
            <div className="border-t border-gray-200 my-2"></div>
            <Link 
              to="/login" 
              className="block py-2 text-blue-600 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign in / Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="hidden md:block h-16"></div>
      <div className="block md:hidden h-24"></div>

      {/* Cart Sidebar - FIXED: Now passing the required props */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;