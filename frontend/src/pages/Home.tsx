import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [activeDeal, setActiveDeal] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
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

  // Auto-rotate hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/products?category=${categoryName}`);
  };

  // Hero slides with products
  const heroSlides = [
    {
      id: 1,
      title: "Premium Audio",
      subtitle: "Sony WH-1000XM5",
      description: "Industry-leading noise cancellation",
      price: 299000,
      oldPrice: 399000,
      discount: 25,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop",
      bgGradient: "from-blue-600 to-purple-600",
      productId: 3
    },
    {
      id: 2,
      title: "Ultimate Performance",
      subtitle: "Samsung Galaxy S22 Ultra",
      description: "The ultimate smartphone experience",
      price: 331000,
      oldPrice: 399000,
      discount: 17,
      image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop",
      bgGradient: "from-purple-600 to-pink-600",
      productId: 1
    },
    {
      id: 3,
      title: "Smart Living",
      subtitle: "Smart LED Desk Lamp Pro",
      description: "Lighting that adapts to you",
      price: 35000,
      oldPrice: 55000,
      discount: 36,
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop",
      bgGradient: "from-amber-500 to-orange-500",
      productId: 4
    },
    {
      id: 4,
      title: "Power & Portability",
      subtitle: "Samsung Galaxy Tab S9 Ultra",
      description: "Your mobile office anywhere",
      price: 899000,
      oldPrice: 1199000,
      discount: 25,
      image: "https://images.unsplash.com/photo-1587033411391-5d9e51cce126?w=800&auto=format&fit=crop",
      bgGradient: "from-green-500 to-teal-500",
      productId: 2
    }
  ];

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

  return (
    <div className="bg-gray-50 overflow-hidden">
      {/* Hero Section - Product Slideshow */}
      <section className="relative h-screen overflow-hidden">
        {/* Slides */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <img 
                src={heroSlides[currentSlide].image} 
                alt={heroSlides[currentSlide].title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${heroSlides[currentSlide].bgGradient} opacity-90`}></div>
            </div>

            {/* Content */}
            <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left side - Text content */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-white"
                >
                  <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-6">
                    ✨ New Season, New Arrivals
                  </span>
                  <h1 className="text-5xl md:text-6xl font-black mb-4">
                    {heroSlides[currentSlide].title}
                  </h1>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white/90">
                    {heroSlides[currentSlide].subtitle}
                  </h2>
                  <p className="text-xl mb-6 text-white/80">
                    {heroSlides[currentSlide].description}
                  </p>
                  
                  {/* Price */}
                  <div className="flex items-baseline gap-3 mb-8">
                    <span className="text-4xl font-bold">
                      {heroSlides[currentSlide].price.toLocaleString()} RWF
                    </span>
                    <span className="text-xl text-white/60 line-through">
                      {heroSlides[currentSlide].oldPrice.toLocaleString()} RWF
                    </span>
                    <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                      -{heroSlides[currentSlide].discount}%
                    </span>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleProductClick(heroSlides[currentSlide].productId)}
                      className="px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold text-lg hover:shadow-xl transition-all"
                    >
                      Shop Now
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/products')}
                      className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all"
                    >
                      View All
                    </motion.button>
                  </div>
                </motion.div>

                {/* Right side - Product image */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="hidden lg:block"
                >
                  <div className="relative">
                    <motion.img 
                      src={heroSlides[currentSlide].image} 
                      alt={heroSlides[currentSlide].title}
                      className="w-full h-auto rounded-2xl shadow-2xl"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {/* Floating badge */}
                    <motion.div 
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 5, repeat: Infinity }}
                      className="absolute -top-4 -right-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-bold shadow-lg"
                    >
                      Limited Offer
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 ${
                currentSlide === index 
                  ? 'w-8 h-2 bg-white' 
                  : 'w-2 h-2 bg-white/50 hover:bg-white/80'
              } rounded-full`}
            />
          ))}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all z-10"
        >
          ←
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all z-10"
        >
          →
        </button>

        {/* Scroll indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
          style={{ bottom: '80px' }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

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
    </div>
  );
};

export default Home;