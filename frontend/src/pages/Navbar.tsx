import { Link } from 'react-router-dom';
import { useState } from 'react';
import Cart from './Cart';

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
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
              
              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-600 hover:text-blue-600 focus:outline-none transition-colors"
              >
                <span className="text-xl">🛒</span>
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              
              <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Cart Sidebar */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;