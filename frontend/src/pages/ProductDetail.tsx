import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from "../config";


type ProductDetailProps = {
  cartItems: any[];
  setCartItems: React.Dispatch<React.SetStateAction<any[]>>;
};

const ProductDetail: React.FC<ProductDetailProps> = ({ cartItems, setCartItems }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError('Failed to load product');
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  // 🛒 Add to cart
  const addToCart = async (product: any) => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const res = await axios.post(
          `${API_URL}/api/cart`,
          { productId: product._id, quantity },
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );

        const serverCart = res.data.items.map((item: any) => ({
          id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
          category: item.product.category || "",
        }));

        setCartItems(serverCart);
        localStorage.setItem("cart", JSON.stringify(serverCart));
        alert('Added to cart 🛒');
        return;
      } catch (err) {
        console.error('Error adding item to cart:', err);
        alert('Failed to add product to cart. Please try again.');
        return;
      }
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((item: any) => item.id === product._id);

    let updatedCart;

    if (existing) {
      updatedCart = cart.map((item: any) =>
        item.id === product._id ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      updatedCart = [...cart, {
        id: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
        category: product.category || "",
      }];
    }

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    alert('Added to cart 🛒');
  };

  // Loading
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500 text-sm">
      Loading product...
    </div>
  );

  // Error / not found
  if (error || !product) return (
    <div className="min-h-screen flex items-center justify-center text-red-500 text-sm">
      {error || 'Product not found'}
    </div>
  );

  return (
    <div className="bg-white min-h-screen mt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Back */}
        <Link to="/products" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">
          ← Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left - Main Image */}
          <div>
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
              <img
                src={product.image || "https://via.placeholder.com/400"}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border-2 border-transparent hover:border-orange-400 cursor-pointer transition-all"
                >
                  <img src={product.image} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Right - Details */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-gray-500 mb-4">{product.description}</p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-bold text-orange-500">
                {product.price.toLocaleString()} RWF
              </span>
              {product.oldPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {product.oldPrice.toLocaleString()} RWF
                </span>
              )}
              {product.discount && (
                <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded font-bold">
                  -{product.discount}%
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-3 mb-5">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center text-gray-600 hover:bg-gray-100"
              >
                −
              </button>
              <span className="text-sm font-medium w-6 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center text-gray-600 hover:bg-gray-100"
              >
                +
              </button>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 mb-5">
              {/* Small Cart */}
              <button
                onClick={() => addToCart(product)}
                className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                title="Add to cart"
              >
                🛒
              </button>

              {/* Buy Now */}
              <button
                onClick={() => navigate(`/products/${product._id}`)}
                className="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-600 text-xs font-semibold py-2 rounded-lg transition"
              >
                Buy Now
              </button>
            </div>

            {/* Delivery & Returns */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-start gap-3">
                <span className="text-green-500 text-lg mt-0.5">🚚</span>
                <div>
                  <p className="text-sm font-semibold text-green-600">We Deliver</p>
                  <p className="text-xs text-gray-500">Delivery fee is calculated at checkout based on your location.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-400 text-lg mt-0.5">🔄</span>
                <div>
                  <p className="text-sm font-semibold text-orange-500">Return Delivery</p>
                  <p className="text-xs text-gray-500">
                    If you are not satisfied with your purchase, you can return it within 24 hours.{' '}
                    <span className="text-blue-500 cursor-pointer hover:underline">Details</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;