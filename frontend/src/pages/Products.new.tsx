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
      <div className="w-full md:w-72 bg-white p-4 border-r">
        <h2 className="font-bold mb-4 text-lg">Filters</h2>

        <input
          type="text"
          placeholder="Search products..."
          className="w-full mb-4 border px-3 py-2 rounded"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
        />

        <select
          className="w-full mb-3 border px-2 py-2 rounded"
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="">All Categories</option>
          {renderCategoryOptions()}
        </select>

        <select
          className="w-full mb-3 border px-2 py-2 rounded"
          value={subcategory}
          onChange={(e) => handleSubcategoryChange(e.target.value)}
          disabled={!category || !activeCategory?.subcategories?.length}
        >
          <option value="">Subcategory</option>
          {activeCategory?.subcategories?.map((sub) => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>

        <select
          className="w-full mb-3 border px-2 py-2 rounded"
          value={brand}
          onChange={(e) => handleBrandChange(e.target.value)}
          disabled={!category || !activeCategory?.brands?.length}
        >
          <option value="">Brand</option>
          {activeCategory?.brands?.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        {activeCategory && Object.keys(activeCategory.specifications || {}).length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Specifications</h3>
            {Object.entries(activeCategory.specifications).map(([specKey, options]) => (
              <div key={specKey} className="mb-3">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {specKey}
                </label>
                <select
                  className="w-full border px-2 py-2 rounded"
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

        <div className="mb-4">
          <label className="text-sm block mb-1">
            Max Price: {priceRange.toLocaleString()} RWF
          </label>
          <input
            type="range"
            min="0"
            max="10000000"
            value={priceRange}
            onChange={(e) => handlePriceChange(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => handleInStockChange(e.target.checked)}
          />
          In Stock Only
        </label>
      </div>

      <div className="flex-1 p-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h1 className="text-xl font-bold">Products</h1>
          <span className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} results
          </span>
        </div>

        {loading ? (
          <div className="text-center py-24 text-gray-500">Loading products...</div>
        ) : error ? (
          <div className="text-center py-24 text-red-500">{error}</div>
        ) : sortedGroupKeys.length === 0 ? (
          <div className="text-center py-24 text-gray-500">No products found.</div>
        ) : (
          sortedGroupKeys.map((groupKey) => {
            const categoryName = categories.find((cat) => cat.key === groupKey)?.name || groupKey;
            const groupProducts = groupedProducts[groupKey] || [];
            return (
              <div key={groupKey} className="mb-8">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">{categoryName}</h2>
                    <p className="text-sm text-gray-500">{groupProducts.length} item(s)</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {groupProducts.map((product) => (
                    <div key={product._id} className="bg-white p-3 rounded-xl shadow hover:shadow-lg transition">
                      <Link to={`/product/${product._id}`}>
                        <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden rounded-lg">
                          <img src={product.image} alt={product.name} className="h-full object-contain" />
                        </div>
                      </Link>

                      <h2 className="text-sm font-semibold mt-2 line-clamp-2">{product.name}</h2>
                      <p className="text-orange-500 font-bold">{product.price.toLocaleString()} RWF</p>
                      <p className={`text-xs ${product.quantity > 0 ? "text-green-500" : "text-red-500"}`}>
                        {product.quantity > 0 ? "In Stock" : "Out"}
                      </p>
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full mt-2 bg-orange-500 text-white py-1 rounded"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Products;
