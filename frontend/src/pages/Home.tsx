import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  // Main categories from the screenshot
  const mainCategories = [
    { 
      title: 'Laptops',
      icon: '💻',
      discount: '$100',
      condition: '$1000+',
      tag: 'Save up to',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300'
    },
    { 
      title: 'Computers',
      icon: '🖥️',
      discount: 'Buy now, save later',
      condition: '$50+',
      tag: '',
      image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=300'
    },
    { 
      title: 'Electronics',
      icon: '📱',
      discount: '$100',
      condition: '$100+',
      tag: 'Save up to',
      image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=300'
    },
    { 
      title: 'Software technology',
      icon: '💿',
      discount: '$100',
      condition: '$100+',
      tag: 'Save up to',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300'
    },
    { 
      title: 'Tablets and tablets',
      icon: '📲',
      discount: '$100',
      condition: '$100+',
      tag: 'Save up to',
      image: 'https://images.unsplash.com/photo-1587033411391-5d9e51cce126?w=300'
    },
    { 
      title: 'Bicycle and bikes models',
      icon: '🚲',
      discount: '$100',
      condition: '$100+',
      tag: 'Save up to',
      image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=300'
    },
    { 
      title: 'Lamps and lamps',
      icon: '💡',
      discount: '$100',
      condition: '$100+',
      tag: 'Save up to',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300'
    },
  ];

  // Trending items from screenshot
  const trendingItems = [
    { name: 'Tank', icon: '🚰', count: '2,345' },
    { name: 'Maps', icon: '🗺️', count: '1,892' },
    { name: 'Luxury', icon: '💎', count: '3,456' },
    { name: 'Collections and art', icon: '🎨', count: '1,567' },
    { name: 'Home and garden', icon: '🏡', count: '2,890' },
    { name: 'Trading tools', icon: '📊', count: '987' },
    { name: 'Health and beauty', icon: '💄', count: '4,321' },
  ];

  // Today's deals
  const todaysDeals = [
    {
      id: 1,
      name: 'AOTI® Pure Bicycling',
      price: 45000,
      oldPrice: 65000,
      discount: 31,
      image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=300',
      seller: 'Top Rated'
    },
    {
      id: 2,
      name: 'Samsung Galaxy Tab A7',
      price: 220000,
      oldPrice: 280000,
      discount: 21,
      image: 'https://images.unsplash.com/photo-1587033411391-5d9e51cce126?w=300',
      seller: 'Trusted Seller'
    },
    {
      id: 3,
      name: 'Wireless Headphones Pro',
      price: 35000,
      oldPrice: 50000,
      discount: 30,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
      seller: 'Top Rated'
    },
    {
      id: 4,
      name: 'LED Desk Lamp',
      price: 15000,
      oldPrice: 25000,
      discount: 40,
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300',
      seller: 'New'
    },
  ];

  return (
    <div className="bg-gray-100">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-2">It's up to you</h1>
            <p className="text-xl mb-4">Customer journey is everything in order of your no-ride</p>
            <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Explore offers →
            </button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* The future in your hands - Categories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6">The future in your hands</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {mainCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.05, duration: 0.3 }}
                whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="h-32 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{category.icon}</span>
                    <h3 className="font-semibold text-gray-800">{category.title}</h3>
                  </div>
                  <div className="text-sm">
                    {category.tag && (
                      <span className="text-gray-500">{category.tag} </span>
                    )}
                    <span className="font-bold text-green-600">{category.condition}</span>
                  </div>
                  <div className="text-sm font-medium text-blue-600 mt-1">
                    {category.discount}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Shopping made easy banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white rounded-lg p-6 mb-12 shadow-sm"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h3 className="text-xl font-bold mb-1">Shopping made easy</h3>
              <p className="text-gray-600">Buy online, save delivery and hassle-free returns.</p>
            </div>
            <button className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Shop Now
            </button>
          </div>
        </motion.div>

        {/* Let the trends follow you */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold mb-2">Let the trends follow you</h3>
                <p className="mb-4">Buy on the Fitbit app and enjoy personalized shopping trends.</p>
                <button className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Shop your shoes →
                </button>
              </div>
              <div className="mt-6 md:mt-0">
                <span className="text-8xl">👟</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Today's Deals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Today's Deals</h2>
            <Link to="/products" className="text-blue-600 hover:underline">See all →</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {todaysDeals.map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
                whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                className="bg-white rounded-lg overflow-hidden shadow-sm"
              >
                <div className="relative h-40">
                  <img src={deal.image} alt={deal.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    -{deal.discount}%
                  </div>
                  {deal.seller === 'Top Rated' && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                      ⭐ Top Rated
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm mb-1 line-clamp-2">{deal.name}</h3>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="font-bold text-blue-600">{deal.price.toLocaleString()} RWF</span>
                    <span className="text-xs text-gray-400 line-through">{deal.oldPrice.toLocaleString()} RWF</span>
                  </div>
                  <p className="text-xs text-green-600">Free shipping</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trending on eBay - Categories List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-4">Trending on eBay</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {trendingItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="text-4xl mb-2">{item.icon}</div>
                <h3 className="font-medium text-sm mb-1">{item.name}</h3>
                <p className="text-xs text-gray-500">{item.count} items</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Categories Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
        >
          {['Electronics', 'Fashion', 'Home & Garden', 'Sports'].map((cat, i) => (
            <div key={cat} className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">{cat}</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li className="hover:text-blue-600 cursor-pointer">New arrivals</li>
                <li className="hover:text-blue-600 cursor-pointer">Best sellers</li>
                <li className="hover:text-blue-600 cursor-pointer">On sale</li>
              </ul>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Home;