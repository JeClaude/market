import { useEffect, useState, useRef } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000";

type Product = {
  _id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  quantity?: number;
  category?: string;
  subcategory?: string;
  brand?: string;
  sku?: string;
  compareAtPrice?: number;
  isFeatured?: boolean;
  specifications?: Record<string, any>;
  variants?: Array<{
    name: string;
    sku: string;
    price: number;
    quantity: number;
    image?: string;
    attributes: Record<string, any>;
  }>;
  images?: Array<{ url: string; alt: string; isPrimary: boolean }>;
};

type CategoryType = {
  _id: string;
  key: string;
  name: string;
  subcategories: string[];
  brands: string[];
  specifications?: Record<string, string[]>;
  isActive: boolean;
  order: number;
};

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<any>({
    name: "",
    price: 0,
    image: "",
    description: "",
    quantity: 0,
    category: "",
    subcategory: "",
    brand: "",
    sku: "",
    compareAtPrice: 0,
    isFeatured: false,
    specifications: {},
    variants: [],
    images: []
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; productId: string | null; productName: string }>({
    isOpen: false,
    productId: null,
    productName: ""
  });
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [currentVariant, setCurrentVariant] = useState<any>({
    name: "",
    sku: "",
    price: 0,
    quantity: 0,
    image: "",
    attributes: {}
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getCategoryByKey = (categoryKey: string) => {
    return categories.find((cat) => cat.key === categoryKey);
  };

  const buildSpecificationsFromCategory = (
    categoryKey: string,
    existingSpecs: Record<string, any> = {}
  ) => {
    const category = getCategoryByKey(categoryKey);
    const specs: Record<string, any> = {};

    if (!category?.specifications) {
      return existingSpecs;
    }

    Object.entries(category.specifications).forEach(([specKey, values]) => {
      specs[specKey] = existingSpecs[specKey] ?? "";
    });

    return specs;
  };

  const token = localStorage.getItem("token");

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products`);
      setProducts(res.data.products || res.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // Fetch categories from database
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/categories`);
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Image upload function
  const uploadImage = async (file: File, productId: string = "temp") => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("productId", productId);

    try {
      setUploading(true);
      const response = await axios.post(`${API_URL}/api/products/upload-image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        }
      });
      
      if (response.data.success) {
        return response.data.imageUrl;
      }
      return null;
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle image selection for create form
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = await uploadImage(file, "temp");
    if (imageUrl) {
      setNewProduct({
        ...newProduct,
        image: imageUrl,
        images: [...newProduct.images, { url: imageUrl, alt: newProduct.name, isPrimary: true }]
      });
    }
  };

  // Handle image selection for update form
  const handleUpdateImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedProduct) return;

    const imageUrl = await uploadImage(file, selectedProduct._id);
    if (imageUrl) {
      const updatedImages = [...(selectedProduct.images || []), { url: imageUrl, alt: selectedProduct.name, isPrimary: false }];
      setSelectedProduct({
        ...selectedProduct,
        image: imageUrl,
        images: updatedImages
      });
    }
  };

  // Delete functions
  const showDeleteConfirm = (id: string, name: string) => {
    setDeleteConfirm({
      isOpen: true,
      productId: id,
      productName: name
    });
  };

  const handleDelete = async () => {
    if (!deleteConfirm.productId) return;

    try {
      await axios.delete(`${API_URL}/api/products/${deleteConfirm.productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts((prev) => prev.filter((p) => p._id !== deleteConfirm.productId));
      setDeleteConfirm({ isOpen: false, productId: null, productName: "" });
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ isOpen: false, productId: null, productName: "" });
  };

  // Update functions
  const openUpdate = (product: Product) => {
    const specs = buildSpecificationsFromCategory(product.category || "", product.specifications || {});
    setSelectedProduct({
      ...product,
      specifications: specs
    });
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!selectedProduct) return;

    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSelectedProduct({
        ...selectedProduct,
        [name]: checked,
      });
      return;
    }

    if (name === "category") {
      setSelectedProduct({
        ...selectedProduct,
        category: value,
        subcategory: "",
        brand: "",
        specifications: buildSpecificationsFromCategory(value, selectedProduct.specifications || {})
      });
      return;
    }

    setSelectedProduct({
      ...selectedProduct,
      [name]: value,
    });
  };

  const handleUpdate = async () => {
    if (!selectedProduct?._id) return;

    try {
      const res = await axios.put(
        `${API_URL}/api/products/${selectedProduct._id}`,
        selectedProduct,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProducts((prev) =>
        prev.map((p) =>
          p._id === selectedProduct._id ? res.data.product : p
        )
      );

      setIsModalOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // Create functions
  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setNewProduct({
        ...newProduct,
        [name]: checked,
      });
      return;
    }

    if (name === "category") {
      setNewProduct({
        ...newProduct,
        category: value,
        subcategory: "",
        brand: "",
        specifications: buildSpecificationsFromCategory(value)
      });
      return;
    }

    setNewProduct({
      ...newProduct,
      [name]: value,
    });
  };

  const updateSpecificationValue = (
    target: "new" | "selected",
    key: string,
    value: string
  ) => {
    const productState = target === "new" ? newProduct : selectedProduct;
    const setter = target === "new" ? setNewProduct : setSelectedProduct;
    if (!productState) return;

    setter({
      ...productState,
      specifications: {
        ...(productState.specifications || {}),
        [key]: value
      }
    });
  };

  const addVariant = () => {
    if (currentVariant.name && currentVariant.price) {
      setNewProduct({
        ...newProduct,
        variants: [...newProduct.variants, currentVariant]
      });
      setCurrentVariant({
        name: "",
        sku: "",
        price: 0,
        quantity: 0,
        image: "",
        attributes: {}
      });
      setShowVariantForm(false);
    }
  };

  const removeVariant = (index: number) => {
    const newVariants = [...newProduct.variants];
    newVariants.splice(index, 1);
    setNewProduct({
      ...newProduct,
      variants: newVariants
    });
  };

  const handleCreateProduct = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/api/products`,
        newProduct,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProducts((prev) => [res.data.product, ...prev]);
      setIsCreateModalOpen(false);
      setNewProduct({
        name: "",
        price: 0,
        image: "",
        description: "",
        quantity: 0,
        category: "",
        subcategory: "",
        brand: "",
        sku: "",
        compareAtPrice: 0,
        isFeatured: false,
        specifications: {},
        variants: [],
        images: []
      });
    } catch (err) {
      console.error("Create product error:", err);
    }
  };

  // Get selected category data
  const getSelectedCategory = () => {
    return categories.find(c => c.key === newProduct.category);
  };

  return (
    <>
      <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 ${isModalOpen || deleteConfirm.isOpen || isCreateModalOpen ? "blur-sm pointer-events-none select-none" : ""}`}>
        <div className="px-2 py-16">
          <div className="container mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Products Management
                  </h1>
                  <p className="text-gray-600 mt-1">Manage your product inventory, update details, and remove items</p>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Product
                </button>
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Total Products: <span className="font-semibold text-gray-700">{products.length}</span>
              </div>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg">No products found</div>
                <p className="text-gray-400 text-sm mt-2">Click "Add Product" to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => {
                  const productCategory = categories.find(c => c.key === product.category);
                  return (
                    <div
                      key={product?._id}
                      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
                    >
                      <div className="relative h-56 w-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                        {product?.image ? (
                          <img
                            src={`${API_URL}${product.image}`}
                            alt={product.name}
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm">No Image</span>
                          </div>
                        )}
                        {product.isFeatured && (
                          <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                            Featured
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                          Stock: {product?.quantity ?? 0}
                        </div>
                        {product.brand && (
                          <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                            {product.brand}
                          </div>
                        )}
                      </div>

                      <div className="p-5 flex flex-col flex-grow">
                        <div className="flex items-start justify-between mb-2">
                          <h2 className="font-bold text-xl text-gray-800 line-clamp-1 flex-1">
                            {product?.name}
                          </h2>
                          {product.category && productCategory && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded ml-2">
                              {productCategory.name.split(' ')[0]}
                            </span>
                          )}
                        </div>

                        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                          {product?.description || "No description available"}
                        </p>

                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-2xl font-bold text-blue-600">
                            ${product?.price?.toFixed(2)}
                          </span>
                          {product.compareAtPrice && product.compareAtPrice > product.price && (
                            <span className="text-sm text-gray-400 line-through">
                              ${product.compareAtPrice.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {product.specifications && Object.keys(product.specifications).length > 0 && (
                          <div className="mb-3 text-xs text-gray-500 space-y-1">
                            {Object.entries(product.specifications).slice(0, 2).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="font-medium">{key}:</span>
                                <span>{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="mt-auto flex gap-2 pt-4 border-t border-gray-100">
                          <button
                            onClick={() => openUpdate(product)}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => showDeleteConfirm(product._id, product.name)}
                            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2.5 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CREATE PRODUCT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md animate-fadeIn"
            onClick={() => setIsCreateModalOpen(false)}
          />
          
          <div className="relative w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl transform transition-all animate-slideUp border border-white/20 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white/95 backdrop-blur-xl z-10 px-6 pt-5 pb-3 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Add New Product</h2>
                    <p className="text-xs text-gray-500">Create a comprehensive product listing</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-6 py-4">
              {/* Basic Information Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Product Name *</label>
                    <input
                      name="name"
                      value={newProduct.name || ""}
                      onChange={handleCreateChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">SKU (Stock Keeping Unit)</label>
                    <input
                      name="sku"
                      value={newProduct.sku || ""}
                      onChange={handleCreateChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Unique product code"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
                    <select
                      name="category"
                      value={newProduct.category}
                      onChange={handleCreateChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat.key}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Brand</label>
                    <select
                      name="brand"
                      value={newProduct.brand}
                      onChange={handleCreateChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Brand</option>
                      {getSelectedCategory()?.brands.map((brand: string) => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Subcategory</label>
                    <select
                      name="subcategory"
                      value={newProduct.subcategory}
                      onChange={handleCreateChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Subcategory</option>
                      {getSelectedCategory()?.subcategories.map((sub: string) => (
                        <option key={sub} value={sub}>{sub.replace('-', ' ').toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={newProduct.isFeatured}
                        onChange={handleCreateChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-xs font-semibold text-gray-700">Feature this product</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Pricing & Inventory</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Price *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                      <input
                        name="price"
                        type="number"
                        step="0.01"
                        value={newProduct.price || ""}
                        onChange={handleCreateChange}
                        className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Compare at Price (Original Price)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                      <input
                        name="compareAtPrice"
                        type="number"
                        step="0.01"
                        value={newProduct.compareAtPrice || ""}
                        onChange={handleCreateChange}
                        className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Quantity</label>
                    <input
                      name="quantity"
                      type="number"
                      value={newProduct.quantity || ""}
                      onChange={handleCreateChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter quantity"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Product Image</label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageSelect}
                      disabled={uploading}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    {uploading && (
                      <div className="mt-2">
                        <div className="text-xs text-blue-600">Uploading: {uploadProgress}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                          <div className="bg-blue-600 h-1 rounded-full transition-all" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Image Preview */}
              {newProduct.image && (
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Image Preview</label>
                  <div className="relative h-32 w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={`${API_URL}${newProduct.image}`}
                      alt="Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const parent = (e.target as HTMLImageElement).parentElement;
                        if (parent) {
                          parent.innerHTML = '<div class="h-full flex items-center justify-center text-gray-400 text-xs">Invalid image URL</div>';
                        }
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Description</h3>
                <textarea
                  name="description"
                  value={newProduct.description || ""}
                  onChange={handleCreateChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Enter detailed product description"
                />
              </div>

              {/* Variants Section */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3 border-b border-gray-200 pb-2">
                  <h3 className="text-lg font-semibold text-gray-800">Product Variants</h3>
                  <button
                    type="button"
                    onClick={() => setShowVariantForm(true)}
                    className="text-sm bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                  >
                    + Add Variant
                  </button>
                </div>

                {showVariantForm && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-3">
                    <h4 className="font-semibold text-sm mb-3">Add New Variant</h4>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <input
                        placeholder="Variant Name (e.g., 1TB, Black)"
                        value={currentVariant.name}
                        onChange={(e) => setCurrentVariant({...currentVariant, name: e.target.value})}
                        className="border rounded-lg px-3 py-2 text-sm"
                      />
                      <input
                        placeholder="SKU"
                        value={currentVariant.sku}
                        onChange={(e) => setCurrentVariant({...currentVariant, sku: e.target.value})}
                        className="border rounded-lg px-3 py-2 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={currentVariant.price}
                        onChange={(e) => setCurrentVariant({...currentVariant, price: parseFloat(e.target.value)})}
                        className="border rounded-lg px-3 py-2 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={currentVariant.quantity}
                        onChange={(e) => setCurrentVariant({...currentVariant, quantity: parseInt(e.target.value)})}
                        className="border rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={addVariant} className="bg-green-500 text-white px-4 py-1 rounded text-sm">Add</button>
                      <button onClick={() => setShowVariantForm(false)} className="bg-gray-500 text-white px-4 py-1 rounded text-sm">Cancel</button>
                    </div>
                  </div>
                )}

                {newProduct.variants.length > 0 && (
                  <div className="space-y-2">
                    {newProduct.variants.map((variant: any, index: number) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{variant.name}</p>
                          <p className="text-xs text-gray-500">SKU: {variant.sku} | Price: ${variant.price} | Stock: {variant.quantity}</p>
                        </div>
                        <button onClick={() => removeVariant(index)} className="text-red-500 hover:text-red-700">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Specifications Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Product Specifications</h3>
                {newProduct.category ? (
                  <>
                    {Object.entries(getCategoryByKey(newProduct.category)?.specifications || {}).length === 0 ? (
                      <p className="text-sm text-gray-500">This category has no predefined specifications. Add spec definitions in Admin Categories.</p>
                    ) : (
                      <div className="space-y-4">
                        {Object.entries(getCategoryByKey(newProduct.category)?.specifications || {}).map(([specKey, options]) => (
                          <div key={specKey} className="grid gap-2 sm:grid-cols-[1fr_180px] items-center">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">{specKey}</label>
                              {Array.isArray(options) && options.length > 0 ? (
                                <select
                                  value={newProduct.specifications?.[specKey] || ""}
                                  onChange={(e) => updateSpecificationValue("new", specKey, e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="">Select {specKey}</option>
                                  {options.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  value={newProduct.specifications?.[specKey] || ""}
                                  onChange={(e) => updateSpecificationValue("new", specKey, e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                  placeholder={`Enter ${specKey}`}
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="mt-3 text-xs text-gray-500">Need more specification types? Add them in Admin Categories.</p>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">Choose a category to load its product specifications.</p>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
              <div className="flex gap-3">
                <button
                  onClick={handleCreateProduct}
                  disabled={!newProduct.name || !newProduct.price || !newProduct.category}
                  className={`flex-1 py-2 rounded-lg transition-all duration-200 font-medium text-sm flex items-center justify-center gap-2 ${
                    !newProduct.name || !newProduct.price || !newProduct.category
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Create Product
                </button>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE MODAL */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md animate-fadeIn"
            onClick={() => setIsModalOpen(false)}
          />
          
          <div className="relative w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl transform transition-all animate-slideUp border border-white/20 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white/95 backdrop-blur-xl z-10 px-6 pt-5 pb-3 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Edit Product</h2>
                    <p className="text-xs text-gray-500">Update product information</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-6 py-4">
              {/* Basic Information Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Product Name *</label>
                    <input
                      name="name"
                      value={selectedProduct.name || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">SKU</label>
                    <input
                      name="sku"
                      value={selectedProduct.sku || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Unique product code"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                    <select
                      name="category"
                      value={selectedProduct.category || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat.key}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Brand</label>
                    <select
                      name="brand"
                      value={selectedProduct.brand || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Brand</option>
                      {selectedProduct.category && categories.find(c => c.key === selectedProduct.category)?.brands.map((brand: string) => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Subcategory</label>
                    <select
                      name="subcategory"
                      value={selectedProduct.subcategory || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Subcategory</option>
                      {selectedProduct.category && categories.find(c => c.key === selectedProduct.category)?.subcategories.map((sub: string) => (
                        <option key={sub} value={sub}>{sub.replace('-', ' ').toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={selectedProduct.isFeatured || false}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-xs font-semibold text-gray-700">Feature this product</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Pricing & Inventory</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Price *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                      <input
                        name="price"
                        type="number"
                        step="0.01"
                        value={selectedProduct.price || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Compare at Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                      <input
                        name="compareAtPrice"
                        type="number"
                        step="0.01"
                        value={selectedProduct.compareAtPrice || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Quantity</label>
                    <input
                      name="quantity"
                      type="number"
                      value={selectedProduct.quantity || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter quantity"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Update Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUpdateImageSelect}
                      disabled={uploading}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    {uploading && (
                      <div className="mt-2">
                        <div className="text-xs text-blue-600">Uploading: {uploadProgress}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                          <div className="bg-blue-600 h-1 rounded-full transition-all" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Image Preview */}
              {selectedProduct.image && (
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Current Image</label>
                  <div className="relative h-32 w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={`${API_URL}${selectedProduct.image}`}
                      alt="Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const parent = (e.target as HTMLImageElement).parentElement;
                        if (parent) {
                          parent.innerHTML = '<div class="h-full flex items-center justify-center text-gray-400 text-xs">Invalid image URL</div>';
                        }
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Specifications Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Product Specifications</h3>
                {selectedProduct.category ? (
                  <>
                    {Object.entries(getCategoryByKey(selectedProduct.category)?.specifications || {}).length === 0 ? (
                      <p className="text-sm text-gray-500">This category has no predefined specifications. Add spec definitions in Admin Categories.</p>
                    ) : (
                      <div className="space-y-4">
                        {Object.entries(getCategoryByKey(selectedProduct.category)?.specifications || {}).map(([specKey, options]) => (
                          <div key={specKey} className="grid gap-2 sm:grid-cols-[1fr_180px] items-center">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">{specKey}</label>
                              {Array.isArray(options) && options.length > 0 ? (
                                <select
                                  value={selectedProduct.specifications?.[specKey] || ""}
                                  onChange={(e) => updateSpecificationValue("selected", specKey, e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="">Select {specKey}</option>
                                  {options.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  value={selectedProduct.specifications?.[specKey] || ""}
                                  onChange={(e) => updateSpecificationValue("selected", specKey, e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                  placeholder={`Enter ${specKey}`}
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="mt-3 text-xs text-gray-500">Need more specification types? Add them in Admin Categories.</p>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">Choose a category to load its product specifications.</p>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Description</h3>
                <textarea
                  name="description"
                  value={selectedProduct.description || ""}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Enter detailed product description"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
              <div className="flex gap-3">
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium text-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={cancelDelete}
          />
          
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all animate-slideUp overflow-hidden">
            <div className="relative px-6 pt-6 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Delete Product</h2>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4">
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete <span className="font-semibold text-red-600">"{deleteConfirm.productName}"</span>?
              </p>
              <p className="text-sm text-gray-500">
                This will permanently remove the product from your inventory.
              </p>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2.5 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Yes, Delete
              </button>
              <button
                onClick={cancelDelete}
                className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.25s ease-out;
        }
      `}</style>
    </>
  );
};

export default AdminProducts;