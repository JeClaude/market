import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import API_URL from "../config";

type ProductType = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  subcategory?: string;
  brand?: string;
  specifications?: Record<string, any>;
};

type CategoryType = {
  _id: string;
  key: string;
  name: string;
  subcategories: string[];
  brands: string[];
  specifications: Record<string, string[]>;
};

type Props = {
  cartItems: any[];
  setCartItems: React.Dispatch<React.SetStateAction<any[]>>;
};

const Products: React.FC<Props> = ({ cartItems, setCartItems }) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [brand, setBrand] = useState("");
  const [inStock, setInStock] = useState(false);
  const [priceRange, setPriceRange] = useState(10000000);
  const [specFilters, setSpecFilters] = useState<Record<string, string>>({});

  const navigate = useNavigate();

  const activeCategory = useMemo(
    () => categories.find((cat) => cat.key === category) || null,
    [categories, category]
  );

  const groupedProducts = useMemo(() => {
    return filteredProducts.reduce<Record<string, ProductType[]>>((acc, product) => {
      const group = product.category || "Uncategorized";
      if (!acc[group]) acc[group] = [];
      acc[group].push(product);
      return acc;
    }, {});
  }, [filteredProducts]);

  const groupOrder = useMemo(() => categories.map((cat) => cat.key), [categories]);

  const sortedGroupKeys = useMemo(() => {
    return Object.keys(groupedProducts).sort((a, b) => {
      const aIndex = groupOrder.indexOf(a);
      const bIndex = groupOrder.indexOf(b);
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  }, [groupedProducts, groupOrder]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/categories`);
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (subcategory) params.set("subcategory", subcategory);
      if (brand) params.set("brand", brand);
      if (search) params.set("search", search);
      if (priceRange < 10000000) params.set("maxPrice", String(priceRange));

      const res = await axios.get(`${API_URL}/api/products?${params.toString()}`);
      const data = res.data.products || res.data;
      setProducts(data || []);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(err?.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const urlCategory = searchParams.get("category") || "";
    const urlSubcategory = searchParams.get("subcategory") || "";
    const urlBrand = searchParams.get("brand") || "";
    const urlSearch = searchParams.get("search") || "";
    const urlMaxPrice = searchParams.get("maxPrice") || "";
    const urlInStock = searchParams.get("inStock") === "true";

    setCategory(urlCategory);
    setSubcategory(urlSubcategory);
    setBrand(urlBrand);
    setSearch(urlSearch);
    setPriceRange(urlMaxPrice ? Number(urlMaxPrice) : 10000000);
    setInStock(urlInStock);
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [category, subcategory, brand, search, priceRange]);

  useEffect(() => {
    let temp = [...products];

    if (search) {
      temp = temp.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      temp = temp.filter((p) => p.category === category);
    }

    if (subcategory) {
      temp = temp.filter((p) => p.subcategory === subcategory);
    }

    if (brand) {
      temp = temp.filter((p) => p.brand === brand);
    }

    if (inStock) {
      temp = temp.filter((p) => p.quantity > 0);
    }

    temp = temp.filter((p) => p.price <= priceRange);

    Object.entries(specFilters).forEach(([specKey, specValue]) => {
      if (!specValue) return;
      temp = temp.filter((product) => {
        const value = product.specifications?.[specKey];
        if (Array.isArray(value)) return value.includes(specValue);
        return String(value) === String(specValue);
      });
    });

    setFilteredProducts(temp);
  }, [products, search, category, subcategory, brand, inStock, priceRange, specFilters]);

  const updateQueryParams = (updates: Record<string, string | boolean | number>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value === false || value === null || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    setSearchParams(params, { replace: true });
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setSubcategory("");
    setBrand("");
    setSpecFilters({});
    updateQueryParams({ category: value, subcategory: "", brand: "" });
  };

  const handleSubcategoryChange = (value: string) => {
    setSubcategory(value);
    updateQueryParams({ subcategory: value });
  };

  const handleBrandChange = (value: string) => {
    setBrand(value);
    updateQueryParams({ brand: value });
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    updateQueryParams({ search: value });
  };

  const handlePriceChange = (value: number) => {
    setPriceRange(value);
    if (value < 10000000) {
      updateQueryParams({ maxPrice: value });
    } else {
      updateQueryParams({ maxPrice: "" });
    }
  };

  const handleInStockChange = (value: boolean) => {
    setInStock(value);
    updateQueryParams({ inStock: value });
  };

  const handleSpecChange = (specKey: string, specValue: string) => {
    setSpecFilters((prev) => ({
      ...prev,
      [specKey]: specValue,
    }));
  };

  const renderCategoryOptions = () => {
    return categories.map((cat) => (
      <option key={cat.key} value={cat.key}>{cat.name}</option>
    ));
  };

  const addToCart = async (product: ProductType | null) => {
    if (!product || !product._id) {
      console.error("Invalid product supplied to addToCart", product);
      alert("Unable to add product to cart.");
      return;
    }

    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.post(
          `${API_URL}/api/cart`,
          { productId: product._id, quantity: 1 },
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );

        const serverCart = (res.data.items || [])
          .filter((item: any) => item && item.product)
          .map((item: any) => ({
            id: item.product._id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.image,
            category: item.product.category || "",
          }));

        setCartItems(serverCart);
        localStorage.setItem("cart", JSON.stringify(serverCart));
        return;
      } catch (err: any) {
        console.error("Error adding item to cart:", err.response?.data || err.message || err);
        alert(err.response?.data?.message || "Failed to add product to cart. Please try again.");
        return;
      }
    }

    const existing = cartItems.find((i) => i.id === product._id);
    let updated;

    if (existing) {
      updated = cartItems.map((i) =>
        i.id === product._id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      updated = [...cartItems, { ...product, quantity: 1, id: product._id }];
    }

    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  return (
    <div className="flex mt-16 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* SIDEBAR FILTERS */}
      <div className="hidden md:block w-60 bg-white h-fit sticky top-20 shadow-lg rounded-xl m-4 p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">🔍</span>
          <h2 className="font-bold text-xl text-gray-800">Filters</h2>
        </div>

        {/* SEARCH */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full border-2 border-gray-200 px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none transition text-sm"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        {/* CATEGORY */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">📦 Category</label>
          <select
            className="w-full border-2 border-gray-200 px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none transition text-sm"
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">All Categories</option>
            {renderCategoryOptions()}
          </select>
        </div>

        {/* SUBCATEGORY */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">📁 Subcategory</label>
          <select
            className="w-full border-2 border-gray-200 px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none transition text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            value={subcategory}
            onChange={(e) => handleSubcategoryChange(e.target.value)}
            disabled={!category || !activeCategory?.subcategories?.length}
          >
            <option value="">All Subcategories</option>
            {activeCategory?.subcategories?.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        {/* BRAND */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">🏷️ Brand</label>
          <select
            className="w-full border-2 border-gray-200 px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none transition text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            value={brand}
            onChange={(e) => handleBrandChange(e.target.value)}
            disabled={!category || !activeCategory?.brands?.length}
          >
            <option value="">All Brands</option>
            {activeCategory?.brands?.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* SPECIFICATIONS */}
        {activeCategory && Object.keys(activeCategory.specifications || {}).length > 0 && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-4 text-sm">⚙️ Specifications</h3>
            {Object.entries(activeCategory.specifications).map(([specKey, options]) => (
              <div key={specKey} className="mb-4">
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase">
                  {specKey}
                </label>
                <select
                  className="w-full border-2 border-gray-200 px-3 py-2 rounded-lg focus:border-blue-500 focus:outline-none transition text-sm"
                  value={specFilters[specKey] || ""}
                  onChange={(e) => handleSpecChange(specKey, e.target.value)}
                >
                  <option value="">Any {specKey}</option>
                  {options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        {/* PRICE RANGE */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <label className="text-sm font-semibold text-gray-700 block mb-3">💰 Max Price</label>
          <div className="bg-blue-50 p-3 rounded-lg mb-3 border border-blue-200">
            <p className="text-xl font-bold text-blue-600">{priceRange.toLocaleString()} RWF</p>
          </div>
          <input
            type="range"
            min="0"
            max="10000000"
            value={priceRange}
            onChange={(e) => handlePriceChange(Number(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0 RWF</span>
            <span>10M RWF</span>
          </div>
        </div>

        {/* IN STOCK FILTER */}
        <label className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border-2 border-green-200 cursor-pointer hover:bg-green-100 transition">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => handleInStockChange(e.target.checked)}
            className="w-5 h-5 cursor-pointer"
          />
          <span className="font-semibold text-gray-700 flex-1">✅ In Stock Only</span>
        </label>
      </div>

      {/* MAIN PRODUCTS SECTION */}
      <div className="flex-1 p-4 md:p-6">
        {/* HEADER */}
        <div className="mb-8"></div>

        {/* LOADING STATE */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          </div>
        )}

        {/* ERROR STATE */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 p-6 rounded-xl mb-6">
            <p className="font-semibold">⚠️ Error Loading Products</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        )}

        {/* NO PRODUCTS */}
        {!loading && filteredProducts.length === 0 && (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
            <p className="text-4xl mb-4">📭</p>
            <p className="text-gray-600 font-semibold mb-2">No products found</p>
            <p className="text-gray-500 text-sm">Try adjusting your filters or search criteria</p>
          </div>
        )}

        {/* PRODUCTS GRID */}
        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
            {filteredProducts.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-300 group"
              >
                {/* IMAGE CONTAINER */}
                <Link to={`/product/${p._id}`} className="block h-48 bg-gray-50 overflow-hidden relative group">
                  {p.image ? (
                    <img
                      src={`${API_URL}${p.image}`}
                      alt={p.name}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300 p-3"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No image</span>
                    </div>
                  )}
                  
                  {/* STOCK BADGE */}
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-bold text-white ${
                    p.quantity > 0 ? "bg-green-500" : "bg-red-500"
                  }`}>
                    {p.quantity > 0 ? "✓ Stock" : "Out"}
                  </div>
                </Link>

                {/* CONTENT */}
                <div className="p-5">
                  <Link to={`/product/${p._id}`} className="block mb-2">
                    <h2 className="text-sm font-bold text-gray-800 line-clamp-2 hover:text-blue-600 transition">
                      {p.name}
                    </h2>
                  </Link>

                  {/* CATEGORY TAG */}
                  <p className="text-xs text-gray-500 mb-3 inline-block bg-gray-100 px-2 py-1 rounded">
                    {p.category || "Uncategorized"}
                  </p>

                  {/* PRICE */}
                  <div className="mb-3">
                    <p className="text-lg font-bold text-blue-600">
                      {p.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">RWF</p>
                  </div>

                  {/* ADD TO CART BUTTON */}
                  <button
                    onClick={() => addToCart(p)}
                    disabled={p.quantity <= 0}
                    className={`w-full py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                      p.quantity > 0
                        ? "bg-gradient-to-r from-orange-400 to-orange-600 text-white hover:shadow-lg hover:scale-105"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {p.quantity > 0 ? "🛒 Add to Cart" : "Out of Stock"}
                  </button>

                  {/* VIEW DETAILS LINK */}
                  <Link
                    to={`/product/${p._id}`}
                    className="block text-center mt-2 text-xs text-blue-600 hover:text-blue-800 font-semibold transition"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;