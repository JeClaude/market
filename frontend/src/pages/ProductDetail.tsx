import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock product data
const products = [
  { 
    id: 1, 
    name: 'Samsung Galaxy S22 Ultra - 256GB - Burgundy', 
    brand: 'Samsung',
    model: 'Galaxy S22 Ultra',
    price: 331000, 
    oldPrice: 399000,
    discount: 17,
    category: 'Ikoranabuhanga', 
    subcategory: 'Telefone',
    condition: 'New',
    lockStatus: 'Factory Unlocked',
    color: 'Burgundy',
    storage: '256GB',
    rating: 5.0,
    reviews: 1245,
    seller: 'zenithmobileslll',
    sellerFeedback: 92.3,
    feedbackCount: 15432,
    description: 'New Sealed SAMSUNG GALAXY S22 ULTRA 5G S908U 128GB | 256GB | 512GB (FACTORY UNLOCKED) SEALED. Adaptive Color Contrast: Streaming on the go, working from your patio or binge-watching late into the night?',
    features: [
      'Dynamic AMOLED 2X display',
      '108MP quad camera system',
      '5000mAh battery',
      'Snapdragon 8 Gen 1 processor',
      'S Pen support'
    ],
    specifications: {
      'Display': '6.8-inch Dynamic AMOLED 2X',
      'Processor': 'Snapdragon 8 Gen 1',
      'RAM': '12GB',
      'Storage': '256GB',
      'Battery': '5000mAh',
      'Camera': '108MP + 12MP + 10MP + 10MP',
      'OS': 'Android 12, One UI 4.1'
    },
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600',
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600',
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600',
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600',
    ],
    returns: '30 days returns. Seller pays for return shipping.',
    inStock: true,
    freeShipping: true,
  },
  // Add more products as needed
];

// Similar products (same category)
const similarProducts = [
  { id: 2, name: 'iPhone 14 Pro Max - 256GB - Deep Purple', price: 499000, oldPrice: 549000, discount: 9, image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=300', rating: 4.9, reviews: 2341 },
  { id: 3, name: 'Google Pixel 7 Pro - 256GB - Obsidian', price: 389000, oldPrice: 429000, discount: 9, image: 'https://images.unsplash.com/photo-1678382563037-5a5f3c98a6b5?w=300', rating: 4.8, reviews: 1234 },
  { id: 4, name: 'OnePlus 11 - 256GB - Eternal Green', price: 299000, oldPrice: 329000, discount: 9, image: 'https://images.unsplash.com/photo-1678382563037-5a5f3c98a6b5?w=300', rating: 4.7, reviews: 892 },
  { id: 5, name: 'Xiaomi 13 Pro - 256GB - Ceramic Black', price: 279000, oldPrice: 309000, discount: 10, image: 'https://images.unsplash.com/photo-1678382563037-5a5f3c98a6b5?w=300', rating: 4.6, reviews: 567 },
];

// Accessories for this product
const accessories = [
  { id: 101, name: 'Samsung 25W Wall Charger', price: 25000, image: 'https://images.unsplash.com/photo-1583863793219-0427c6c99ed0?w=300', category: 'Charger' },
  { id: 102, name: 'Samsung Galaxy S22 Ultra Case', price: 15000, image: 'https://images.unsplash.com/photo-1541877941-ac6c089b2bff?w=300', category: 'Case' },
  { id: 103, name: 'Tempered Glass Screen Protector', price: 8000, image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300', category: 'Screen Protection' },
  { id: 104, name: 'Samsung Galaxy Buds2 Pro', price: 89000, image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300', category: 'Earbuds' },
  { id: 105, name: 'Wireless Charging Stand', price: 35000, image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=300', category: 'Charger' },
  { id: 106, name: 'USB-C to 3.5mm Adapter', price: 5000, image: 'https://images.unsplash.com/photo-1612178991541-b48cc8e92a4d?w=300', category: 'Adapter' },
];

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  // Find product by id (in real app, this would be an API call)
  const product = products.find(p => p.id === Number(id)) || products[0];

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600">eBay</Link>
            <span>›</span>
            <Link to="/categories" className="hover:text-blue-600">Electronics</Link>
            <span>›</span>
            <Link to="/products?category=CellPhones" className="hover:text-blue-600">Cell Phones & Accessories</Link>
            <span>›</span>
            <Link to="/products?category=CellPhones&subcategory=Smartphones" className="hover:text-blue-600">Cell Phones & Smartphones</Link>
            <span className="text-gray-900 font-medium truncate">› {product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Images */}
            <div>
              {/* Main Image */}
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
                <img 
                  src={product.images[selectedImage]} 
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Thumbnails */}
              <div className="flex gap-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-blue-600' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div>
              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              {/* Subtitle */}
              <p className="text-gray-600 mb-3">(Unlocked)</p>

              {/* Ratings */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </div>
                  <span className="ml-1 text-sm font-medium text-gray-700">{product.rating} product ratings</span>
                </div>
                <div className="text-sm text-gray-500">
                  {product.reviews} reviews
                </div>
              </div>

              {/* Seller Info */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-600">{product.seller}</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                  {product.sellerFeedback}% positive feedback
                </span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ${(product.price / 1000).toFixed(2)}
                  </span>
                  {product.oldPrice && (
                    <>
                      <span className="text-lg text-gray-400 line-through">
                        ${(product.oldPrice / 1000).toFixed(2)}
                      </span>
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                        Save {product.discount}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Returns */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Returns:</span> {product.returns}
                </p>
              </div>

              {/* Condition */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-500">Condition:</span>
                  <p className="font-medium">{product.condition}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Lock Status:</span>
                  <p className="font-medium">{product.lockStatus}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Color:</span>
                  <p className="font-medium">{product.color}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Storage:</span>
                  <p className="font-medium">{product.storage}</p>
                </div>
              </div>

              {/* Description Snippet */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">{product.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Buy It Now
                </button>
                <button className="flex-1 border-2 border-blue-600 text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                  Add to cart
                </button>
              </div>

              {/* See all details link */}
              <div className="mt-3 text-center">
                <button className="text-sm text-blue-600 hover:underline">
                  See all details
                </button>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-8 border-t pt-8">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-6 py-3 font-medium text-sm transition-colors ${
                  activeTab === 'description' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('specifications')}
                className={`px-6 py-3 font-medium text-sm transition-colors ${
                  activeTab === 'specifications' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`px-6 py-3 font-medium text-sm transition-colors ${
                  activeTab === 'shipping' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Shipping & Returns
              </button>
            </div>

            <div className="py-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'description' && (
                    <div className="prose max-w-none">
                      <p className="text-gray-700">{product.description}</p>
                      <ul className="list-disc pl-5 mt-4 space-y-2">
                        {product.features.map((feature, index) => (
                          <li key={index} className="text-gray-600">{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeTab === 'specifications' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex border-b pb-2">
                          <span className="w-1/3 font-medium text-gray-600">{key}:</span>
                          <span className="w-2/3 text-gray-800">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'shipping' && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Shipping</h4>
                        <p className="text-gray-600">Free shipping on orders over $50</p>
                        <p className="text-gray-600">Estimated delivery: 3-5 business days</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Returns</h4>
                        <p className="text-gray-600">{product.returns}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Similar products you might like</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {similarProducts.map((item) => (
              <Link to={`/product/${item.id}`} key={item.id}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-3"
                >
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-sm font-medium line-clamp-2 mb-2">{item.name}</h3>
                  <div className="flex items-center gap-1 mb-1">
                    <div className="flex text-yellow-400 text-xs">
                      {'⭐'.repeat(Math.floor(item.rating))}
                    </div>
                    <span className="text-xs text-gray-500">({item.reviews})</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-bold text-blue-600">${(item.price / 1000).toFixed(2)}</span>
                    <span className="text-xs text-gray-400 line-through">${(item.oldPrice / 1000).toFixed(2)}</span>
                    <span className="text-xs text-green-600">-{item.discount}%</span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Accessories Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Popular accessories for {product.brand} {product.model}</h2>
          
          {/* Accessories by category */}
          <div className="space-y-6">
            {/* Chargers Category */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Chargers & Cables</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {accessories.filter(a => a.category === 'Charger').map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-3"
                  >
                    <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-sm font-medium line-clamp-2 mb-2">{item.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="font-bold text-blue-600">${(item.price / 1000).toFixed(2)}</span>
                    </div>
                    <button className="w-full mt-2 py-1 text-sm border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors">
                      Add to cart
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Cases & Protection */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Cases & Protection</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {accessories.filter(a => a.category === 'Case' || a.category === 'Screen Protection').map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-3"
                  >
                    <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-sm font-medium line-clamp-2 mb-2">{item.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="font-bold text-blue-600">${(item.price / 1000).toFixed(2)}</span>
                    </div>
                    <button className="w-full mt-2 py-1 text-sm border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors">
                      Add to cart
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Audio */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Audio</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {accessories.filter(a => a.category === 'Earbuds').map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-3"
                  >
                    <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-sm font-medium line-clamp-2 mb-2">{item.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="font-bold text-blue-600">${(item.price / 1000).toFixed(2)}</span>
                    </div>
                    <button className="w-full mt-2 py-1 text-sm border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors">
                      Add to cart
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;