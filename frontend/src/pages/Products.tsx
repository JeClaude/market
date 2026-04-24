import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config";

// SAME CATEGORY STRUCTURE FROM ADMIN
import { CATEGORIES } from "../data/categories"; // 👈 create this file and paste your CATEGORIES there

type ProductType = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  subcategory?: string;
  brand?: string;
};

type Props = {
  cartItems: any[];
  setCartItems: React.Dispatch<React.SetStateAction<any[]>>;
};

const Products: React.FC<Props> = ({ cartItems, setCartItems }) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);

  // FILTER STATES
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [brand, setBrand] = useState("");
  const [inStock, setInStock] = useState(false);
  const [priceRange, setPriceRange] = useState(10000000);

  const navigate = useNavigate();

  // FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get(`${API_URL}api/products`);
      const data = res.data.products || res.data;
      setProducts(data);
      setFilteredProducts(data);
    };
    fetchProducts();
  }, []);

  // FILTER ENGINE 🧠
  useEffect(() => {
    let temp = [...products];

    if (search) {
      temp = temp.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      temp = temp.filter(p => p.category === category);
    }

    if (subcategory) {
      temp = temp.filter(p => p.subcategory === subcategory);
    }

    if (brand) {
      temp = temp.filter(p => p.brand === brand);
    }

    if (inStock) {
      temp = temp.filter(p => p.quantity > 0);
    }

    temp = temp.filter(p => p.price <= priceRange);

    setFilteredProducts(temp);
  }, [search, category, subcategory, brand, inStock, priceRange, products]);

  // CART
  const addToCart = (product: ProductType) => {
    const existing = cartItems.find(i => i.id === product._id);
    let updated;

    if (existing) {
      updated = cartItems.map(i =>
        i.id === product._id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      updated = [...cartItems, { ...product, quantity: 1, id: product._id }];
    }

    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  return (
    <div className="flex mt-16 min-h-screen bg-gray-50">

      {/* 🧱 SIDEBAR FILTER */}
      <div className="w-64 bg-white p-4 border-r hidden md:block">
        <h2 className="font-bold mb-4 text-lg">Filters</h2>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search..."
          className="w-full mb-4 border px-3 py-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* CATEGORY */}
        <select
          className="w-full mb-3 border px-2 py-2 rounded"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setSubcategory("");
            setBrand("");
          }}
        >
          <option value="">All Categories</option>
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <option key={key} value={key}>{cat.name}</option>
          ))}
        </select>

        {/* SUBCATEGORY */}
        <select
          className="w-full mb-3 border px-2 py-2 rounded"
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          disabled={!category}
        >
          <option value="">Subcategory</option>
          {category &&
            CATEGORIES[category]?.subcategories.map((sub: string) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
        </select>

        {/* BRAND */}
        <select
          className="w-full mb-3 border px-2 py-2 rounded"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          disabled={!category}
        >
          <option value="">Brand</option>
          {category &&
            CATEGORIES[category]?.brands.map((b: string) => (
              <option key={b} value={b}>{b}</option>
            ))}
        </select>

        {/* PRICE */}
        <div className="mb-4">
          <label className="text-sm">Max Price: {priceRange} RWF</label>
          <input
            type="range"
            min="0"
            max="10000000"
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* STOCK */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={inStock}
            onChange={() => setInStock(!inStock)}
          />
          In Stock Only
        </label>
      </div>

      {/* 🛍️ PRODUCTS */}
      <div className="flex-1 p-4">
        <h1 className="text-xl font-bold mb-4">
          Products ({filteredProducts.length})
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map(p => (
            <div key={p._id} className="bg-white p-3 rounded-xl shadow hover:shadow-lg transition">
              <Link to={`/product/${p._id}`}>
                <div className="h-40 bg-gray-100 flex items-center justify-center">
                  <img src={p.image} className="h-full object-contain" />
                </div>
              </Link>

              <h2 className="text-sm font-semibold mt-2 line-clamp-2">{p.name}</h2>

              <p className="text-orange-500 font-bold">{p.price.toLocaleString()} RWF</p>

              <p className={`text-xs ${p.quantity > 0 ? "text-green-500" : "text-red-500"}`}>
                {p.quantity > 0 ? "In Stock" : "Out"}
              </p>

              <button
                onClick={() => addToCart(p)}
                className="w-full mt-2 bg-orange-500 text-white py-1 rounded"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;