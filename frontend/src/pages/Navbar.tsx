import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FiMenu, FiShoppingCart, FiSearch } from 'react-icons/fi';

type NavbarProps = {
  openCart: () => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  cartItems: { id: number; quantity: number }[];
};

const Navbar: React.FC<NavbarProps> = ({ openCart, isLoggedIn, setIsLoggedIn, cartItems }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Auto close menu when clicking a link
  const handleMobileLinkClick = () => setIsMobileMenuOpen(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' : 'bg-white/80 backdrop-blur-sm py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">

        {/* Desktop */}
        <div className="hidden md:flex justify-between items-center">
          <Link to="/" className="text-xl font-semibold text-gray-900">Ability Traders</Link>
          <div className="flex space-x-6 items-center">
            <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
            <Link to="/products" className="text-gray-600 hover:text-blue-600">Products</Link>

            <button onClick={openCart} className="relative p-2">
              <FiShoppingCart className="w-5 h-5 text-gray-600" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {isLoggedIn ? (
              <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Logout
              </button>
            ) : (
              <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Login</Link>
            )}
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <div className="flex justify-between items-center py-2">
            <Link to="/" className="text-xl font-bold text-gray-900">Ability Traders</Link>
            <div className="flex items-center gap-3">
              <button onClick={openCart} className="relative p-1 text-gray-700">
                <FiShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-1 text-gray-700">
                <FiMenu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Mobile Menu - pushes content down */}
          <div
            className={`overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-[700px]' : 'max-h-0'}`}
          >
            <div className="px-4 py-3 space-y-3 bg-white shadow rounded-md">

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for anything"
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md"
                />
                <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>

              <Link to="/" onClick={handleMobileLinkClick} className="block py-2 text-gray-700">Home</Link>
              <Link to="/categories" onClick={handleMobileLinkClick} className="block py-2 text-gray-700">Categories</Link>
              <Link to="/products" onClick={handleMobileLinkClick} className="block py-2 text-gray-700">Products</Link>

              <div className="border-t border-gray-200 my-2"></div>

              {isLoggedIn ? (
                <button
                  onClick={() => { handleLogout(); handleMobileLinkClick(); }}
                  className="block py-2 text-red-600 font-medium w-full text-left"
                >
                  Logout
                </button>
              ) : (
                <Link to="/login" onClick={handleMobileLinkClick} className="block py-2 text-blue-600 font-medium">Sign in / Register</Link>
              )}
            </div>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;