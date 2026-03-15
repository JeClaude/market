import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Mock products data
// Mock products data - all electronics
const products = [
  { id: 1, name: 'A25 Portable Bluetooth Speaker', price: 12000, category: 'Ikoranabuhanga', subcategory: 'Audio', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200' },
  { id: 2, name: 'Wireless Gaming Mouse', price: 14000, category: 'Ikoranabuhanga', subcategory: 'Computer Accessories', image: 'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=200' },
  { id: 3, name: 'Smart Watch Series 7', price: 14000, category: 'Ikoranabuhanga', subcategory: 'Wearables', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200' },
  { id: 4, name: 'JBL Tune 1000BT Pro', price: 29000, category: 'Ikoranabuhanga', subcategory: 'Audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200' },
  { id: 5, name: 'Samsung LED Monitor 24"', price: 100000, category: 'Ikoranabuhanga', subcategory: 'Computer Accessories', image: 'https://images.unsplash.com/photo-1581091215367-34b29bcd2d20?w=200' },
  { id: 6, name: 'Apple AirPods Pro', price: 35000, category: 'Ikoranabuhanga', subcategory: 'Audio', image: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0642?w=200' },
  { id: 7, name: 'GoPro Hero 10', price: 150000, category: 'Ikoranabuhanga', subcategory: 'Cameras', image: 'https://images.unsplash.com/photo-1606813902893-0efc94e0e5f5?w=200' },
  { id: 8, name: 'Imiringa Smart LED TV', price: 350000, category: 'Ikoranabuhanga', subcategory: 'TVs', image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=200' },
  { id: 9, name: 'TWK TK-802 Wireless Headphones', price: 25000, category: 'Ikoranabuhanga', subcategory: 'Audio', image: 'https://images.unsplash.com/photo-1585298723682-7115561c51b7?w=200' },
  { id: 10, name: 'Mechanical Gaming Keyboard', price: 35000, category: 'Ikoranabuhanga', subcategory: 'Computer Accessories', image: 'https://images.unsplash.com/photo-1617179029750-d0b2e6f9a96a?w=200' },
  { id: 11, name: 'Universal Laptop Stand', price: 45000, category: 'Ikoranabuhanga', subcategory: 'Computer Accessories', image: 'https://images.unsplash.com/photo-1586171198141-8f1f9be6b8a6?w=200' },
  { id: 12, name: 'Samsung USB-C Adapter', price: 15000, category: 'Ikoranabuhanga', subcategory: 'Computer Accessories', image: 'https://images.unsplash.com/photo-1612178991541-b48cc8e92a4d?w=200' },
];

// Categories from the image
const categories = [
  { name: 'Abana', icon: '👶' },
  { name: 'Amasaha', icon: '⏰' },
  { name: 'Amatara', icon: '💡' },
  { name: 'Ibindi', icon: '📦' },
  { name: 'Ibinyabiziga', icon: '🚗' },
  { name: 'Ibya siporo', icon: '⚽' },
  { name: 'Ibyo mu gikoni', icon: '🍳' },
  { name: 'Ibyo mu rugo', icon: '🏠' },
  { name: 'Ikoranabuhanga', icon: '💻' },
  { name: 'Imiringa', icon: '📱' },
  { name: 'Imisatsi', icon: '💇' },
  { name: 'Imitako', icon: '💍' },
  { name: 'Imyambaro', icon: '👕' },
];

const Products = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15; // 5 rows × 3 columns

  // Filter products based on search query, category, and price range
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery) ||
      product.category.toLowerCase().includes(searchQuery) ||
      product.price.toString().includes(searchQuery);
    
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory || product.subcategory === selectedCategory;
    
    const matchesPriceMin = priceRange.min === '' || product.price >= Number(priceRange.min);
    const matchesPriceMax = priceRange.max === '' || product.price <= Number(priceRange.max);
    
    return matchesSearch && matchesCategory && matchesPriceMin && matchesPriceMax;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const clearFilters = () => {
    setSelectedCategory('All');
    setPriceRange({ min: '', max: '' });
    setCurrentPage(1);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className="flex gap-6 p-5 max-w-7xl mx-auto">
      {/* Sidebar Filters */}
      <div className="w-64 bg-white p-4 rounded-lg h-fit border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-gray-700">Filters</h3>
          <button 
            onClick={clearFilters}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Clear All
          </button>
        </div>

        {/* Search */}
        <div className="mb-5">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search products..." 
              defaultValue={searchQuery}
              className="w-full text-sm border border-gray-300 rounded-md py-2 pl-8 pr-3 focus:outline-none focus:border-blue-500"
            />
            <span className="absolute left-2 top-2.5 text-gray-400 text-sm">🔍</span>
          </div>
        </div>

        {/* Categories with Scrollbar */}
        <div 
          className="space-y-1 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#d1d5db #f3f4f6'
          }}
        >
          {categories.map((category) => (
            <div
              key={category.name}
              onClick={() => handleCategoryClick(category.name)}
              className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                selectedCategory === category.name 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span className="text-base">{category.icon}</span>
              <span className="text-xs">{category.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="mb-4">
          <Link to="/" className="text-xs text-gray-600 hover:text-gray-800">
            ← Back to Home
          </Link>
        </div>

        {searchQuery && (
          <p className="mb-4 text-sm text-gray-600">
            Search results for: "{searchQuery}"
          </p>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {currentProducts.length > 0 ? (
            currentProducts.map(product => (
              <div key={product.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                {/* Product Image - Clickable */}
                <div 
                  onClick={() => handleProductClick(product.id)}
                  className="bg-gray-100 h-32 mb-2 rounded flex items-center justify-center text-gray-400 text-xs cursor-pointer overflow-hidden"
                >
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                <h3 className="font-medium text-xs mb-1 line-clamp-2">{product.name}</h3>
                
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-bold text-sm">
                    {product.price.toLocaleString()} RWF
                  </span>
                  {product.price < 15000 && (
                    <span className="text-[10px] text-green-600 bg-green-50 px-1 py-0.5 rounded">
                      -{Math.round((15000 - product.price) / 15000 * 100)}%
                    </span>
                  )}
                </div>

                {/* Original price if discounted */}
                {product.price < 15000 && (
                  <div className="text-[10px] text-gray-400 line-through mb-1">
                    15,000 RWF
                  </div>
                )}

                {/* Category tags */}
                <div className="flex flex-wrap gap-1 mb-2">
                  <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded">
                    {product.subcategory || product.category}
                  </span>
                </div>

                {/* Gura Nonaha button - Clickable */}
                <button 
                  onClick={() => handleProductClick(product.id)}
                  className="w-full bg-black text-white py-1.5 rounded text-xs hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Gura Nonaha
                </button>

                <div className="mt-1 text-center">
                  <Link to={`/product/${product.id}`} className="text-[10px] text-blue-600 hover:underline">
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500 text-sm">
              No products found matching your search.
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 text-xs rounded ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Previous
            </button>

            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && handlePageChange(page)}
                disabled={page === '...'}
                className={`px-3 py-1 text-xs rounded ${
                  page === '...'
                    ? 'cursor-default'
                    : currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 text-xs rounded ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Next
            </button>
          </div>
        )}

        {/* Products count indicator */}
        <div className="mt-3 text-xs text-gray-500 text-right">
          Showing {currentProducts.length} of {filteredProducts.length} products
        </div>
      </div>
    </div>
  );
};

export default Products;