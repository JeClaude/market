import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config";

type ProductType = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
};

type ProductsProps = {
  cartItems: any[];
  setCartItems: React.Dispatch<React.SetStateAction<any[]>>;
};

const Products: React.FC<ProductsProps> = ({ cartItems, setCartItems }) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}api/products`);
        setProducts(res.data);
      } catch (err) {
        console.error(err);
        setError("Error loading products");
      }
      setLoading(false);
    };
    getProducts();
  }, []);

  const addToCart = async (product: ProductType) => {
    if (token) {
      try {
        const res = await axios.post(`${API_URL}api/cart`, {
          productId: product._id,
          quantity: 1
        }, { headers: { Authorization: `Bearer ${token}` } });

        const serverCart = res.data.items.map((item: any) => ({
          id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
          category: item.product.category || ""
        }));
        setCartItems(serverCart);
        alert("Added to cart 🛒 (server)");
      } catch (err) {
        console.error(err);
        alert("Error adding to cart");
      }
    } else {
      const existing = cartItems.find(item => item.id === product._id);
      let updatedCart;
      if (existing) {
        updatedCart = cartItems.map(item =>
          item.id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedCart = [...cartItems, { ...product, quantity: 1, id: product._id }];
      }
      setCartItems(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      alert("Added to cart 🛒 (local)");
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen text-gray-500">Loading products...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen mt-16 px-4 md:px-8 py-6">
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-gray-800">All Products</h1>
      {products.length === 0 ? (
        <p className="text-gray-500">No products found</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map(product => (
            <div key={product._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden group">
              <Link to={`/product/${product._id}`}>
                <div className="h-40 bg-gray-100 overflow-hidden">
                  <img
                    src={product.image || "https://via.placeholder.com/200"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
              </Link>
              <div className="p-3">
                <h2 className="text-sm font-medium text-gray-800 line-clamp-2">{product.name}</h2>
                <p className="text-orange-500 font-bold text-sm mt-1">{product.price.toLocaleString()} RWF</p>
                <p className="text-xs text-gray-400 mt-1 mb-2">{product.quantity > 0 ? "In stock" : "Out of stock"}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => addToCart(product)}
                    className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                    title="Add to cart">🛒</button>
                  <button onClick={() => navigate(`/product/${product._id}`)}
                    className="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-600 text-xs font-semibold py-2 rounded-lg transition">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;