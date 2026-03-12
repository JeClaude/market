import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [activeDeal, setActiveDeal] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  // Auto-rotate deals
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveDeal((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/products?category=${categoryName}`);
  };

  // Main categories with stunning visuals
  const mainCategories = [
    { 
      id: 1,
      title: 'Laptops',
      subtitle: 'Ultimate Performance',
      icon: '💻',
      discount: '$100 OFF',
      condition: '$1000+',
      tag: 'Limited Time',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop',
      gradient: 'from-blue-600 to-cyan-500',
      bgColor: 'bg-blue-50',
      items: 2345
    },
    { 
      id: 2,
      title: 'Computers',
      subtitle: 'Power & Speed',
      icon: '🖥️',
      discount: 'Save Later',
      condition: '$50+',
      tag: 'Best Value',
      image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=600&auto=format&fit=crop',
      gradient: 'from-purple-600 to-pink-500',
      bgColor: 'bg-purple-50',
      items: 1892
    },
    { 
      id: 3,
      title: 'Electronics',
      subtitle: 'Innovation Hub',
      icon: '📱',
      discount: '$150 OFF',
      condition: '$100+',
      tag: 'Flash Sale',
      image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&auto=format&fit=crop',
      gradient: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      items: 3456
    },
    { 
      id: 4,
      title: 'Software',
      subtitle: 'Digital Solutions',
      icon: '💿',
      discount: '40% OFF',
      condition: 'All',
      tag: 'Digital',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop',
      gradient: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      items: 1567
    },
    { 
      id: 5,
      title: 'Tablets',
      subtitle: 'Portable Power',
      icon: '📲',
      discount: '$80 OFF',
      condition: '$200+',
      tag: 'New',
      image: 'https://images.unsplash.com/photo-1587033411391-5d9e51cce126?w=600&auto=format&fit=crop',
      gradient: 'from-indigo-500 to-blue-500',
      bgColor: 'bg-indigo-50',
      items: 2890
    },
    { 
      id: 6,
      title: 'Bicycles',
      subtitle: 'Eco-Friendly',
      icon: '🚲',
      discount: '25% OFF',
      condition: '$300+',
      tag: 'Sport',
      image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop',
      gradient: 'from-yellow-500 to-amber-500',
      bgColor: 'bg-yellow-50',
      items: 987
    },
    { 
      id: 7,
      title: 'Lamps',
      subtitle: 'Smart Lighting',
      icon: '💡',
      discount: '$30 OFF',
      condition: '$50+',
      tag: 'Smart Home',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop',
      gradient: 'from-teal-500 to-cyan-500',
      bgColor: 'bg-teal-50',
      items: 4321
    },
  ];

  // Premium deals
  const premiumDeals = [
    {
      id: 1,
      name: 'Samsung Galaxy S22 Ultra',
      price: 331000,
      oldPrice: 399000,
      discount: 17,
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop',
      rating: 4.8,
      reviews: 234,
      seller: 'Premium Seller',
      badge: '🔥 Hot Deal',
      freeShipping: true
    },
    {
      id: 2,
      name: 'Samsung Galaxy Tab S9 Ultra',
      price: 899000,
      oldPrice: 1199000,
      discount: 25,
      image: 'https://images.unsplash.com/photo-1587033411391-5d9e51cce126?w=600&auto=format&fit=crop',
      rating: 4.9,
      reviews: 567,
      seller: 'Official Store',
      badge: '⭐ Best Seller',
      freeShipping: true
    },
    {
      id: 3,
      name: 'Sony WH-1000XM5 Headphones',
      price: 299000,
      oldPrice: 399000,
      discount: 25,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop',
      rating: 4.9,
      reviews: 892,
      seller: 'Audio Expert',
      badge: '🎧 Top Rated',
      freeShipping: true
    },
    {
      id: 4,
      name: 'Smart LED Desk Lamp Pro',
      price: 35000,
      oldPrice: 55000,
      discount: 36,
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop',
      rating: 4.7,
      reviews: 156,
      seller: 'Smart Home',
      badge: '💡 Smart Choice',
      freeShipping: false
    },
  ];

  // Trending categories with animations
  const trendingCategories = [
    { id: 101, name: 'Luxury Watches', icon: '⌚', count: '2.3k', color: 'from-amber-400 to-yellow-500', trending: true },
    { id: 102, name: 'Art Collections', icon: '🎨', count: '1.8k', color: 'from-purple-400 to-pink-500', trending: true },
    { id: 103, name: 'Gaming PCs', icon: '🎮', count: '3.2k', color: 'from-blue-400 to-indigo-500', trending: true },
    { id: 104, name: 'Vintage Cameras', icon: '📷', count: '956', color: 'from-green-400 to-emerald-500', trending: false },
    { id: 105, name: 'Designer Bags', icon: '👜', count: '2.1k', color: 'from-red-400 to-rose-500', trending: true },
    { id: 106, name: 'Smart Home', icon: '🏠', count: '4.5k', color: 'from-cyan-400 to-teal-500', trending: true },
    { id: 107, name: 'Fitness Gear', icon: '💪', count: '1.4k', color: 'from-orange-400 to-red-500', trending: false },
    { id: 108, name: 'Musical Instruments', icon: '🎸', count: '892', color: 'from-violet-400 to-purple-500', trending: true },
  ];

  // Brand partners
  const brands = [
    { name: 'Apple', logo: '🍎', color: 'from-gray-500 to-gray-700' },
    { name: 'Samsung', logo: '📱', color: 'from-blue-500 to-blue-700' },
    { name: 'Sony', logo: '🎮', color: 'from-black to-gray-800' },
    { name: 'LG', logo: '💡', color: 'from-red-500 to-red-700' },
    { name: 'Dell', logo: '💻', color: 'from-blue-600 to-blue-800' },
    { name: 'HP', logo: '🖨️', color: 'from-teal-500 to-teal-700' },
  ];

  return (
    <div className="bg-gray-50 overflow-hidden">
      {/* Hero Section - Parallax with video-like effect */}
      <motion.section 
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x"></div>
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-1/2 -right-1/2 w-full h-full bg-white opacity-10 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, -180, -360],
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-white opacity-10 rounded-full blur-3xl"
          />
        </div>

        {/* Floating elements */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -30, 30, -30],
              x: [null, 30, -30, 30],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              opacity: 0.2 + Math.random() * 0.3,
            }}
          />
        ))}

        <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-lg rounded-full text-sm mb-6">
              ✨ New Season, New Arrivals
            </span>
            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
              It's Up to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                You
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90">
              Customer journey is everything. Discover amazing products tailored just for you.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/products')}
                className="group relative px-8 py-4 bg-white text-gray-900 rounded-full font-semibold text-lg overflow-hidden"
              >
                <span className="relative z-10">Explore Offers</span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/categories')}
                className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all"
              >
                Browse Categories
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white rounded-full mt-2"
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Stats Banner - Floating cards */}
      <section className="relative -mt-20 z-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { number: '50K+', label: 'Products', icon: '📦', color: 'from-blue-500 to-cyan-500' },
              { number: '10K+', label: 'Sellers', icon: '🤝', color: 'from-purple-500 to-pink-500' },
              { number: '100K+', label: 'Customers', icon: '👥', color: 'from-orange-500 to-red-500' },
              { number: '24/7', label: 'Support', icon: '🛎️', color: 'from-green-500 to-emerald-500' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-xl backdrop-blur-lg cursor-pointer`}
                onClick={() => navigate('/products')}
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold">{stat.number}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* The future in your hands - Stunning Category Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              The Future in Your Hands
            </h2>
            <p className="text-xl text-gray-600">Cutting-edge technology awaits you</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mainCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                onHoverStart={() => setHoveredCategory(index)}
                onHoverEnd={() => setHoveredCategory(null)}
                onClick={() => handleCategoryClick(category.title)}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all cursor-pointer"
              >
                {/* Image with overlay */}
                <div className="relative h-48 overflow-hidden">
                  <motion.img 
                    src={category.image} 
                    alt={category.title}
                    className="w-full h-full object-cover"
                    animate={{ scale: hoveredCategory === index ? 1.1 : 1 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-60`} />
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-gray-800">
                      {category.tag}
                    </span>
                  </div>
                  
                  {/* Icon */}
                  <div className="absolute bottom-4 right-4 text-4xl transform group-hover:rotate-12 transition-transform">
                    {category.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{category.title}</h3>
                      <p className="text-sm text-gray-500">{category.subtitle}</p>
                    </div>
                    <span className="text-sm text-gray-400">{category.items}+ items</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-gray-500">{category.condition}</span>
                    <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                      {category.discount}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: '70%' }}
                      viewport={{ once: true }}
                      className={`h-full bg-gradient-to-r ${category.gradient}`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Shopping made easy - 3D Card */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, rotateX: -15 }}
            whileInView={{ opacity: 1, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative perspective-1000"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 transform-gpu preserve-3d hover:rotateX-5 transition-all duration-500">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-white mb-6 md:mb-0">
                  <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm mb-4">
                    🚀 New Feature
                  </span>
                  <h3 className="text-3xl md:text-4xl font-bold mb-2">Shopping made easy</h3>
                  <p className="text-xl opacity-90 mb-4">Buy online, save delivery and hassle-free returns.</p>
                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => navigate('/products')}
                      className="px-6 py-3 bg-white text-blue-900 rounded-xl font-semibold"
                    >
                      Start Shopping
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => navigate('/categories')}
                      className="px-6 py-3 border-2 border-white text-white rounded-xl font-semibold"
                    >
                      Learn More
                    </motion.button>
                  </div>
                </div>
                <motion.div
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="text-9xl"
                >
                  🛍️
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Let the trends follow you - Interactive Banner */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1200" 
                alt="Fashion"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-pink-900/90"></div>
            </div>
            
            <div className="relative p-12 md:p-20 text-white">
              <div className="max-w-2xl">
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-6">
                    🔥 Trending Now
                  </span>
                  <h3 className="text-4xl md:text-5xl font-black mb-4">Let the trends follow you</h3>
                  <p className="text-xl mb-8 opacity-90">Buy on the Fitbit app and enjoy personalized shopping trends.</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => navigate('/products?category=Imyambaro')}
                      className="px-8 py-4 bg-white text-purple-900 rounded-xl font-bold text-lg flex items-center gap-2"
                    >
                      <span>Shop your shoes</span>
                      <span>→</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => navigate('/products')}
                      className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold text-lg"
                    >
                      Download App
                    </motion.button>
                  </div>
                </motion.div>
              </div>
              
              {/* Floating shoes */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute bottom-12 right-12 text-9xl hidden lg:block"
              >
                👟
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Today's Deals - Carousel */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-center mb-12"
          >
            <div>
              <h2 className="text-4xl font-black mb-2">Today's Deals</h2>
              <p className="text-gray-600">Limited time offers. Grab them before they're gone!</p>
            </div>
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  onClick={() => setActiveDeal(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    activeDeal === i ? 'w-8 bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeDeal}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {premiumDeals.map((deal, index) => (
                <motion.div
                  key={deal.id}
                  whileHover={{ y: -10, scale: 1.02 }}
                  onClick={() => handleProductClick(deal.id)}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={deal.image} 
                      alt={deal.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold">
                        -{deal.discount}%
                      </span>
                    </div>
                    {deal.badge && (
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-xs font-bold">
                          {deal.badge}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{deal.name}</h3>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex text-yellow-400">
                        {'⭐'.repeat(Math.floor(deal.rating))}
                      </div>
                      <span className="text-sm text-gray-500">({deal.reviews})</span>
                    </div>
                    
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-2xl font-bold text-blue-600">
                        {deal.price.toLocaleString()} RWF
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        {deal.oldPrice.toLocaleString()} RWF
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-600">{deal.seller}</span>
                      {deal.freeShipping && (
                        <span className="text-xs text-green-600 font-bold">🚚 Free Shipping</span>
                      )}
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(deal.id);
                      }}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Gura Nonaha
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Trending Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black mb-2">Trending Categories</h2>
            <p className="text-gray-600">Most popular categories right now</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trendingCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                onClick={() => handleCategoryClick(category.name)}
                className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                
                {category.trending && (
                  <div className="absolute top-4 right-4">
                    <span className="text-xs">🔥</span>
                  </div>
                )}
                
                <div className="text-5xl mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all">
                  {category.icon}
                </div>
                <h3 className="font-bold text-lg mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} items</p>
                
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Partners */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white text-center mb-12"
          >
            Trusted by Leading Brands
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {brands.map((brand, index) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                onClick={() => navigate(`/products?brand=${brand.name}`)}
                className={`bg-gradient-to-br ${brand.color} p-6 rounded-2xl text-white text-center shadow-xl cursor-pointer`}
              >
                <div className="text-4xl mb-2">{brand.logo}</div>
                <div className="font-semibold">{brand.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-white opacity-5 rounded-full blur-3xl"
        />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black mb-4"
          >
            Stay in the Loop
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl mb-8 opacity-90"
          >
            Subscribe to get exclusive deals, new arrivals, and special offers
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-yellow-400"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-yellow-400 text-gray-900 rounded-xl font-bold hover:bg-yellow-500 transition-colors"
            >
              Subscribe
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;