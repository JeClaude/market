import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000";

type Category = {
  _id: string;
  key: string;
  name: string;
  subcategories: string[];
  brands: string[];
  specifications: Record<string, string[]>;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
};

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    key: "",
    name: "",
    order: 0
  });
  
  // Subcategories state
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [newSubcategory, setNewSubcategory] = useState("");
  const [editingSubcategoryIndex, setEditingSubcategoryIndex] = useState<number | null>(null);
  const [editingSubcategoryText, setEditingSubcategoryText] = useState("");

  // Brands state
  const [brands, setBrands] = useState<string[]>([]);
  const [newBrand, setNewBrand] = useState("");
  const [editingBrandIndex, setEditingBrandIndex] = useState<number | null>(null);
  const [editingBrandText, setEditingBrandText] = useState("");
  
  // Specifications state
  const [specifications, setSpecifications] = useState<Record<string, string[]>>({});
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");
  const [newSpecValuesList, setNewSpecValuesList] = useState<string[]>([]);
  
  // Edit value states for each specification
  const [editingSpecKey, setEditingSpecKey] = useState<string | null>(null);
  const [editingValueIndex, setEditingValueIndex] = useState<number | null>(null);
  const [editingValueText, setEditingValueText] = useState("");
  
  // Store input values for each specification's "Add new value" field
  const [specInputValues, setSpecInputValues] = useState<Record<string, string>>({});

  const token = localStorage.getItem("token");

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/categories`);
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // ==================== SUBCATEGORIES CRUD ====================
  const addSubcategory = () => {
    if (newSubcategory.trim() && !subcategories.includes(newSubcategory.trim())) {
      setSubcategories([...subcategories, newSubcategory.trim()]);
      setNewSubcategory("");
    }
  };

  const removeSubcategory = (index: number) => {
    setSubcategories(subcategories.filter((_, i) => i !== index));
  };

  const startEditingSubcategory = (index: number, value: string) => {
    setEditingSubcategoryIndex(index);
    setEditingSubcategoryText(value);
  };

  const updateSubcategory = () => {
    if (editingSubcategoryIndex !== null && editingSubcategoryText.trim()) {
      const updated = [...subcategories];
      updated[editingSubcategoryIndex] = editingSubcategoryText.trim();
      setSubcategories(updated);
      cancelEditingSubcategory();
    }
  };

  const cancelEditingSubcategory = () => {
    setEditingSubcategoryIndex(null);
    setEditingSubcategoryText("");
  };

  // ==================== BRANDS CRUD ====================
  const addBrand = () => {
    if (newBrand.trim() && !brands.includes(newBrand.trim())) {
      setBrands([...brands, newBrand.trim()]);
      setNewBrand("");
    }
  };

  const removeBrand = (index: number) => {
    setBrands(brands.filter((_, i) => i !== index));
  };

  const startEditingBrand = (index: number, value: string) => {
    setEditingBrandIndex(index);
    setEditingBrandText(value);
  };

  const updateBrand = () => {
    if (editingBrandIndex !== null && editingBrandText.trim()) {
      const updated = [...brands];
      updated[editingBrandIndex] = editingBrandText.trim();
      setBrands(updated);
      cancelEditingBrand();
    }
  };

  const cancelEditingBrand = () => {
    setEditingBrandIndex(null);
    setEditingBrandText("");
  };

  // ==================== SPECIFICATIONS CRUD ====================
  const updateSpecInputValue = (specKey: string, value: string) => {
    setSpecInputValues({
      ...specInputValues,
      [specKey]: value
    });
  };

  const clearSpecInputValue = (specKey: string) => {
    setSpecInputValues({
      ...specInputValues,
      [specKey]: ""
    });
  };

  // Add value to new specification list
  const addValueToList = () => {
    if (newSpecValue.trim()) {
      if (!newSpecValuesList.includes(newSpecValue.trim())) {
        setNewSpecValuesList([...newSpecValuesList, newSpecValue.trim()]);
      }
      setNewSpecValue("");
    }
  };

  // Remove value from new specification list
  const removeValueFromList = (index: number) => {
    setNewSpecValuesList(newSpecValuesList.filter((_, i) => i !== index));
  };

  // Add specification
  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecValuesList.length > 0) {
      setSpecifications({
        ...specifications,
        [newSpecKey.trim()]: newSpecValuesList
      });
      setNewSpecKey("");
      setNewSpecValuesList([]);
    }
  };

  // Remove specification
  const removeSpecification = (key: string) => {
    const newSpecs = { ...specifications };
    delete newSpecs[key];
    setSpecifications(newSpecs);
    // Also clean up input value for this spec
    const newInputValues = { ...specInputValues };
    delete newInputValues[key];
    setSpecInputValues(newInputValues);
  };

  // Add value to existing specification
  const addValueToSpec = (specKey: string, value: string) => {
    if (value.trim()) {
      const currentValues = specifications[specKey] || [];
      if (!currentValues.includes(value.trim())) {
        setSpecifications({
          ...specifications,
          [specKey]: [...currentValues, value.trim()]
        });
      }
    }
  };

  // Remove value from existing specification
  const removeValueFromSpec = (specKey: string, valueIndex: number) => {
    const currentValues = [...(specifications[specKey] || [])];
    currentValues.splice(valueIndex, 1);
    setSpecifications({
      ...specifications,
      [specKey]: currentValues
    });
  };

  // Start editing a value
  const startEditingValue = (specKey: string, valueIndex: number, currentValue: string) => {
    setEditingSpecKey(specKey);
    setEditingValueIndex(valueIndex);
    setEditingValueText(currentValue);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingSpecKey(null);
    setEditingValueIndex(null);
    setEditingValueText("");
  };

  // Update existing value
  const updateValue = () => {
    if (editingSpecKey !== null && editingValueIndex !== null && editingValueText.trim()) {
      const currentValues = [...(specifications[editingSpecKey] || [])];
      currentValues[editingValueIndex] = editingValueText.trim();
      setSpecifications({
        ...specifications,
        [editingSpecKey]: currentValues
      });
      cancelEditing();
    }
  };

  // Open create modal
  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      key: "",
      name: "",
      order: categories.length
    });
    setSubcategories([]);
    setBrands([]);
    setSpecifications({});
    setSpecInputValues({});
    setNewSubcategory("");
    setNewBrand("");
    setNewSpecKey("");
    setNewSpecValue("");
    setNewSpecValuesList([]);
    cancelEditingSubcategory();
    cancelEditingBrand();
    cancelEditing();
    setIsModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      key: category.key,
      name: category.name,
      order: category.order
    });
    setSubcategories(category.subcategories || []);
    setBrands(category.brands || []);
    setSpecifications(category.specifications || {});
    setSpecInputValues({});
    setNewSubcategory("");
    setNewBrand("");
    setNewSpecKey("");
    setNewSpecValue("");
    setNewSpecValuesList([]);
    cancelEditingSubcategory();
    cancelEditingBrand();
    cancelEditing();
    setIsModalOpen(true);
  };

  // Save category
  const handleSave = async () => {
    try {
      const categoryData = {
        key: formData.key.toLowerCase().replace(/\s+/g, "-"),
        name: formData.name,
        subcategories: subcategories,
        brands: brands,
        specifications: specifications,
        order: formData.order
      };

      if (editingCategory) {
        await axios.put(`${API_URL}/api/categories/${editingCategory._id}`, categoryData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_URL}/api/categories`, categoryData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.error("Error saving category:", err);
    }
  };

  // Delete category
  const handleDelete = async () => {
    if (!deletingCategory) return;

    try {
      await axios.delete(`${API_URL}/api/categories/${deletingCategory._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsDeleteConfirmOpen(false);
      setDeletingCategory(null);
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <div className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Category Management
              </h1>
              <p className="text-gray-600 mt-1">Manage product categories, subcategories, brands, and specifications</p>
            </div>
            <button
              onClick={openCreateModal}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Category
            </button>
          </div>

          {/* Categories Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg">No categories found</div>
              <p className="text-gray-400 text-sm mt-2">Click "Add Category" to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">📁</span>
                          <h2 className="text-xl font-bold text-gray-800">{category.name}</h2>
                        </div>
                        <p className="text-sm text-gray-500 font-mono">key: {category.key}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(category)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setDeletingCategory(category);
                            setIsDeleteConfirmOpen(true);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Subcategories */}
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Subcategories:</h3>
                      <div className="flex flex-wrap gap-2">
                        {category.subcategories.length > 0 ? (
                          category.subcategories.map((sub, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {sub}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">No subcategories</span>
                        )}
                      </div>
                    </div>

                    {/* Brands */}
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Brands:</h3>
                      <div className="flex flex-wrap gap-2">
                        {category.brands.length > 0 ? (
                          category.brands.map((brand, idx) => (
                            <span key={idx} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                              {brand}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">No brands</span>
                        )}
                      </div>
                    </div>

                    {/* Specifications */}
                    {category.specifications && Object.keys(category.specifications).length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Specifications:</h3>
                        <div className="space-y-2">
                          {Object.entries(category.specifications).map(([specKey, specValues]) => (
                            <div key={specKey} className="bg-gray-50 rounded-lg p-2">
                              <p className="text-xs font-semibold text-gray-700 capitalize mb-1">{specKey}:</p>
                              <div className="flex flex-wrap gap-1">
                                {specValues.map((value, idx) => (
                                  <span key={idx} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                                    {value}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
                      Order: {category.order}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal with Tags for Subcategories, Brands, and Specifications */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl transform transition-all overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 pt-5 pb-3 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h2>
            </div>

            <div className="px-6 py-4 space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category Key *</label>
                  <input
                    name="key"
                    value={formData.key}
                    onChange={handleChange}
                    placeholder="e.g., computers-laptops"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Unique identifier (lowercase, use hyphens)</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category Name *</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Computers & Laptops"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* ==================== SUBCATEGORIES SECTION ==================== */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subcategories</label>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {subcategories.map((sub, idx) => (
                      <span
                        key={idx}
                        onClick={() => startEditingSubcategory(idx, sub)}
                        className="cursor-pointer bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1 hover:bg-gray-300 transition-colors"
                      >
                        {sub}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSubcategory(idx);
                          }}
                          className="text-gray-500 hover:text-red-500 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={editingSubcategoryIndex !== null ? "Edit subcategory..." : "Add new subcategory..."}
                      value={editingSubcategoryIndex !== null ? editingSubcategoryText : newSubcategory}
                      onChange={(e) => {
                        if (editingSubcategoryIndex !== null) {
                          setEditingSubcategoryText(e.target.value);
                        } else {
                          setNewSubcategory(e.target.value);
                        }
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && editingSubcategoryIndex === null) {
                          addSubcategory();
                        }
                      }}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    {editingSubcategoryIndex !== null ? (
                      <>
                        <button
                          onClick={updateSubcategory}
                          disabled={!editingSubcategoryText.trim()}
                          className={`px-5 py-2 rounded-lg text-sm ${
                            !editingSubcategoryText.trim()
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-green-500 text-white hover:bg-green-600"
                          }`}
                        >
                          Update
                        </button>
                        <button
                          onClick={cancelEditingSubcategory}
                          className="px-5 py-2 rounded-lg text-sm bg-gray-300 text-gray-700 hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={addSubcategory}
                        disabled={!newSubcategory.trim()}
                        className={`px-5 py-2 rounded-lg text-sm ${
                          !newSubcategory.trim()
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* ==================== BRANDS SECTION ==================== */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Brands</label>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {brands.map((brand, idx) => (
                      <span
                        key={idx}
                        onClick={() => startEditingBrand(idx, brand)}
                        className="cursor-pointer bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1 hover:bg-blue-200 transition-colors"
                      >
                        {brand}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeBrand(idx);
                          }}
                          className="text-blue-500 hover:text-red-500 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={editingBrandIndex !== null ? "Edit brand..." : "Add new brand..."}
                      value={editingBrandIndex !== null ? editingBrandText : newBrand}
                      onChange={(e) => {
                        if (editingBrandIndex !== null) {
                          setEditingBrandText(e.target.value);
                        } else {
                          setNewBrand(e.target.value);
                        }
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && editingBrandIndex === null) {
                          addBrand();
                        }
                      }}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    {editingBrandIndex !== null ? (
                      <>
                        <button
                          onClick={updateBrand}
                          disabled={!editingBrandText.trim()}
                          className={`px-5 py-2 rounded-lg text-sm ${
                            !editingBrandText.trim()
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-green-500 text-white hover:bg-green-600"
                          }`}
                        >
                          Update
                        </button>
                        <button
                          onClick={cancelEditingBrand}
                          className="px-5 py-2 rounded-lg text-sm bg-gray-300 text-gray-700 hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={addBrand}
                        disabled={!newBrand.trim()}
                        className={`px-5 py-2 rounded-lg text-sm ${
                          !newBrand.trim()
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Display Order</label>
                <input
                  name="order"
                  type="number"
                  value={formData.order}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* ==================== SPECIFICATIONS SECTION ==================== */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Specifications</h3>

                {/* Existing Specifications */}
                {Object.keys(specifications).length > 0 && (
                  <div className="mb-4 space-y-3">
                    {Object.entries(specifications).map(([specKey, specValues]) => (
                      <div key={specKey} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-gray-700 capitalize">{specKey}</span>
                          <button
                            onClick={() => removeSpecification(specKey)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                        
                        {/* Values as clickable tags for editing */}
                        <div className="flex flex-wrap gap-2 mb-2">
                          {specValues.map((value, idx) => (
                            <span
                              key={idx}
                              onClick={() => startEditingValue(specKey, idx, value)}
                              className="cursor-pointer bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-1 hover:bg-purple-200 transition-colors"
                            >
                              {value}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeValueFromSpec(specKey, idx);
                                }}
                                className="text-purple-500 hover:text-purple-700 ml-1"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        
                        {/* Add/Edit input field */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder={editingSpecKey === specKey ? "Edit value..." : "Add new value..."}
                            value={editingSpecKey === specKey ? editingValueText : (specInputValues[specKey] || "")}
                            onChange={(e) => {
                              if (editingSpecKey === specKey) {
                                setEditingValueText(e.target.value);
                              } else {
                                updateSpecInputValue(specKey, e.target.value);
                              }
                            }}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                          />
                          {editingSpecKey === specKey ? (
                            <>
                              <button
                                onClick={updateValue}
                                disabled={!editingValueText.trim()}
                                className={`px-5 py-2 rounded-lg text-sm ${
                                  !editingValueText.trim()
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-green-500 text-white hover:bg-green-600"
                                }`}
                              >
                                Update
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="px-5 py-2 rounded-lg text-sm bg-gray-300 text-gray-700 hover:bg-gray-400"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => {
                                const inputValue = specInputValues[specKey] || "";
                                if (inputValue.trim()) {
                                  addValueToSpec(specKey, inputValue);
                                  clearSpecInputValue(specKey);
                                }
                              }}
                              disabled={!(specInputValues[specKey] || "").trim()}
                              className={`px-5 py-2 rounded-lg text-sm ${
                                !(specInputValues[specKey] || "").trim()
                                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                  : "bg-blue-500 text-white hover:bg-blue-600"
                              }`}
                            >
                              Add
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Specification */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Add New Specification</h4>
                  <div className="mb-3">
                    <input
                      type="text"
                      placeholder="Specification name (e.g., processor, ram, storage)"
                      value={newSpecKey}
                      onChange={(e) => setNewSpecKey(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* Values as Tags */}
                  <div className="mb-3">
                    <label className="text-xs text-gray-500 mb-1 block">Values (click Add after each value)</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {newSpecValuesList.map((value, idx) => (
                        <span key={idx} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                          {value}
                          <button
                            onClick={() => removeValueFromList(idx)}
                            className="text-green-500 hover:text-green-700 ml-1"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type a value..."
                        value={newSpecValue}
                        onChange={(e) => setNewSpecValue(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addValueToList();
                          }
                        }}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={addValueToList}
                        disabled={!newSpecValue.trim()}
                        className={`px-5 py-2 rounded-lg text-sm ${
                          !newSpecValue.trim()
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                      >
                        Add Value
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={addSpecification}
                    disabled={!newSpecKey.trim() || newSpecValuesList.length === 0}
                    className={`w-full text-sm px-4 py-2 rounded-lg mt-2 ${
                      !newSpecKey.trim() || newSpecValuesList.length === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    + Add Specification
                  </button>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                onClick={handleSave}
                disabled={!formData.key || !formData.name}
                className={`flex-1 py-2 rounded-lg font-medium ${
                  !formData.key || !formData.name
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
                }`}
              >
                {editingCategory ? "Update Category" : "Create Category"}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && deletingCategory && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeleteConfirmOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Delete Category</h2>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-700">
                Are you sure you want to delete <span className="font-semibold text-red-600">"{deletingCategory.name}"</span>?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This will remove the category from the system. Products with this category will still exist but may need to be reassigned.
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
              <button onClick={handleDelete} className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">
                Yes, Delete
              </button>
              <button onClick={() => setIsDeleteConfirmOpen(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;