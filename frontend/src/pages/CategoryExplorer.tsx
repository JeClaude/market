import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Categories with rich metadata
const categories = [
  { 
    id: 1, 
    name: 'Imyambaro', 
    translation: 'Clothing',
    icon: '👕',
    color: 'from-blue-500 to-cyan-500',
    productCount: 1245,
    subcategories: ['Imisatsi', 'Imyenda', 'Amakote', 'Ingofero'],
    trending: true,
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500'
  },
  { 
    id: 2, 
    name: 'Ikoranabuhanga', 
    translation: 'Technology',
    icon: '💻',
    color: 'from-purple-500 to-pink-500',
    productCount: 892,
    subcategories: ['Ibinyabiziga', 'Imiringa', 'Telefone', 'Mashini'],
    trending: true,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500'
  },
  { 
    id: 3, 
    name: 'Ibyo mu rugo', 
    translation: 'Home & Living',
    icon: '🏠',
    color: 'from-amber-500 to-orange-500',
    productCount: 2341,
    subcategories: ['Ibitanda', 'Amatafari', 'Imirongo', 'Amadiriza'],
    trending: false,
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500'
  },
  { 
    id: 4, 
    name: 'Ibyo mu gikoni', 
    translation: 'Kitchen',
    icon: '🍳',
    color: 'from-green-500 to-emerald-500',
    productCount: 1567,
    subcategories: ['Ibikoresho', 'Amatara', 'Ibiryori', 'Amasahani'],
    trending: true,
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500'
  },
  { 
    id: 5, 
    name: 'Ibya siporo', 
    translation: 'Sports',
    icon: '⚽',
    color: 'from-red-500 to-rose-500',
    productCount: 678,
    subcategories: ['Umupira', 'Imipira', 'Imyambaro y\'imikino', 'Ibyuma'],
    trending: false,
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500'
  },
  { 
    id: 6, 
    name: 'Imitako', 
    translation: 'Accessories',
    icon: '💍',
    color: 'from-yellow-500 to-amber-500',
    productCount: 3456,
    subcategories: ['Imisatsi', 'Imizinga', 'Amasaha', 'Ibitambara'],
    trending: true,
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=500'
  },
  { 
    id: 7, 
    name: 'Abana', 
    translation: 'Children',
    icon: '👶',
    color: 'from-sky-500 to-blue-500',
    productCount: 892,
    subcategories: ['Imyambaro y\'abana', 'Ibikinisho', 'Ibitabo', 'Amashuri'],
    trending: false,
    image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=500'
  },
  { 
    id: 8, 
    name: 'Amasaha', 
    translation: 'Watches',
    icon: '⏰',
    color: 'from-indigo-500 to-purple-500',
    productCount: 445,
    subcategories: ['Amasaha y\'abagabo', 'Amasaha y\'abagore', 'Amasaha y\'abana', 'Smart watches'],
    trending: true,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500'
  },
];

// Subcategories with product counts (like the numbers in your image)
const subcategories = [
  { name: 'Imisatsi', parent: 'Imyambaro', count: 245, icon: '💇' },
  { name: 'Imyenda', parent: 'Imyambaro', count: 567, icon: '👔' },
  { name: 'Amakote', parent: 'Imyambaro', count: 189, icon: '🧥' },
  { name: 'Ingofero', parent: 'Imyambaro', count: 244, icon: '🧢' },
  { name: 'Ibinyabiziga', parent: 'Ikoranabuhanga', count: 342, icon: '🚗' },
  { name: 'Imiringa', parent: 'Ikoranabuhanga', count: 278, icon: '📱' },
  { name: 'Telefone', parent: 'Ikoranabuhanga', count: 156, icon: '📞' },
  { name: 'Mashini', parent: 'Ikoranabuhanga', count: 116, icon: '⚙️' },
  { name: 'Ibitanda', parent: 'Ibyo mu rugo', count: 432, icon: '🛏️' },
  { name: 'Amatafari', parent: 'Ibyo mu rugo', count: 567, icon: '🧱' },
  { name: 'Imirongo', parent: 'Ibyo mu rugo', count: 678, icon: '🪑' },
  { name: 'Amadiriza', parent: 'Ibyo mu rugo', count: 664, icon: '🪟' },
  { name: 'Ibikoresho', parent: 'Ibyo mu gikoni', count: 789, icon: '🍳' },
  { name: 'Amatara', parent: 'Ibyo mu gikoni', count: 234, icon: '💡' },
  { name: 'Ibiryori', parent: 'Ibyo mu gikoni', count: 345, icon: '🍽️' },
  { name: 'Amasahani', parent: 'Ibyo mu gikoni', count: 199, icon: '🥘' },
  { name: 'Umupira', parent: 'Ibya siporo', count: 156, icon: '⚽' },
  { name: 'Imipira', parent: 'Ibya siporo', count: 189, icon: '🏀' },
  { name: 'Imyambaro y\'imikino', parent: 'Ibya siporo', count: 234, icon: '🎽' },
  { name: 'Ibyuma', parent: 'Ibya siporo', count: 99, icon: '🏋️' },
];

const CategoryExplorer = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.translation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSubcategoriesForParent = (parentName) => {
    return subcategories.filter(sub => sub.parent === parentName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white"
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Explore Ability Traders
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl mb-8 max-w-2xl"
          >
            Discover thousands of products across 50+ categories. Find exactly what you're looking for.
          </motion.p>
          
          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <span className="absolute right-3 top-3 text-gray-400">🔍</span>
              </div>
              <button 
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="px-4 py-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all"
              >
                {viewMode === 'grid' ? '⊞' : '☰'}
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Category Stats Banner */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="bg-white shadow-md"
      >
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">12,458</div>
              <div className="text-sm text-gray-600">Total Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">50+</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">1,245</div>
              <div className="text-sm text-gray-600">New Arrivals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Categories Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Trending Categories */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: animateIn ? 1 : 0, x: animateIn ? 0 : -20 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-red-500 w-2 h-8 rounded-full mr-3"></span>
            Trending Now 🔥
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.filter(c => c.trending).map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="relative group cursor-pointer"
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-r rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                  style={{
                    background: `linear-gradient(to right, ${category.color.split(' ')[1]}, ${category.color.split(' ')[3]})`
                  }}
                ></div>
                <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className={`h-32 bg-gradient-to-r ${category.color}`}></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-4xl">{category.icon}</span>
                      <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">+{Math.floor(Math.random() * 50) + 20}%</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{category.translation}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{category.productCount.toLocaleString()} products</span>
                      <Link 
                        to={`/products?category=${category.name}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Explore →
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* All Categories with Subcategories (like the numbers in your image) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: animateIn ? 1 : 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-blue-500 w-2 h-8 rounded-full mr-3"></span>
            All Categories
          </h2>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.05, duration: 0.5 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className={`h-24 bg-gradient-to-r ${category.color} relative`}>
                    <div className="absolute -bottom-6 left-4">
                      <span className="text-5xl bg-white p-2 rounded-xl shadow-lg">{category.icon}</span>
                    </div>
                  </div>
                  <div className="pt-8 p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-600">{category.translation}</p>
                      </div>
                      <span className="text-2xl font-bold text-gray-300">{category.productCount}</span>
                    </div>
                    
                    {/* Subcategories with numbers (like your image) */}
                    <div className="space-y-2 mb-4">
                      {getSubcategoriesForParent(category.name).map((sub, idx) => (
                        <motion.div
                          key={sub.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1 + idx * 0.02 }}
                          className="flex items-center justify-between text-sm group cursor-pointer hover:bg-gray-50 p-1 rounded"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">{sub.icon}</span>
                            <span className="text-gray-700">{sub.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-xs">{sub.count}</span>
                            <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <Link
                      to={`/products?category=${category.name}`}
                      className="block w-full text-center bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      View All {category.productCount} Products
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            // List View
            <div className="space-y-4">
              {filteredCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.05 }}
                  className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center text-3xl`}>
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{category.translation}</p>
                        </div>
                        <span className="text-2xl font-bold text-gray-300">{category.productCount}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {getSubcategoriesForParent(category.name).map(sub => (
                          <span key={sub.name} className="inline-flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded">
                            {sub.icon} {sub.name} <span className="text-gray-500 ml-1">{sub.count}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Interactive Number Explorer (like your image with all the numbers) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: animateIn ? 1 : 0, y: animateIn ? 0 : 20 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white"
        >
          <h3 className="text-2xl font-bold mb-4">Popular Product IDs</h3>
          <p className="text-gray-400 mb-6">Click any number to explore products in that range</p>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-gray-800 rounded-lg">
            {Array.from({ length: 200 }, (_, i) => i + 1).map(num => (
              <motion.span
                key={num}
                whileHover={{ scale: 1.2, backgroundColor: '#3b82f6' }}
                className="inline-block px-2 py-1 bg-gray-700 rounded text-xs cursor-pointer hover:bg-blue-600 transition-all"
                onClick={() => window.location.href = `/products?minId=${num * 10}&maxId=${num * 10 + 9}`}
              >
                {num * 10}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CategoryExplorer;