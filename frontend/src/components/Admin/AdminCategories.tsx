import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";

const API_URL = "http://localhost:5000";

type Category = {
  _id: string;
  key: string;
  name: string;
  subcategories: string[];
  brands: string[];
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
    subcategories: "",
    brands: "",
    order: 0
  });

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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Open create modal
  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      key: "",
      name: "",
      subcategories: "",
      brands: "",
      order: categories.length
    });
    setIsModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      key: category.key,
      name: category.name,
      subcategories: category.subcategories.join(", "),
      brands: category.brands.join(", "),
      order: category.order
    });
    setIsModalOpen(true);
  };

  // Save category (create or update)
  const handleSave = async () => {
    try {
      const categoryData = {
        key: formData.key.toLowerCase().replace(/\s+/g, "-"),
        name: formData.name,
        subcategories: formData.subcategories.split(",").map(s => s.trim()).filter(s => s),
        brands: formData.brands.split(",").map(b => b.trim()).filter(b => b),
        order: formData.order
      };

      if (editingCategory) {
        // Update
        await axios.put(`${API_URL}/api/categories/${editingCategory._id}`, categoryData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Create
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
              <p className="text-gray-600 mt-1">Manage product categories, subcategories, and brands</p>
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
                          category.subcategories.map((sub) => (
                            <span key={sub} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {sub}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">No subcategories</span>
                        )}
                      </div>
                    </div>

                    {/* Brands */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Brands:</h3>
                      <div className="flex flex-wrap gap-2">
                        {category.brands.length > 0 ? (
                          category.brands.map((brand) => (
                            <span key={brand} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                              {brand}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">No brands</span>
                        )}
                      </div>
                    </div>

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

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl transform transition-all overflow-hidden">
            <div className="px-6 pt-5 pb-3 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h2>
            </div>

            <div className="px-6 py-4 space-y-4">
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

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Subcategories</label>
                <textarea
                  name="subcategories"
                  value={formData.subcategories}
                  onChange={handleChange}
                  placeholder="Enter subcategories separated by commas&#10;e.g., laptops, desktops, tablets"
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Brands</label>
                <textarea
                  name="brands"
                  value={formData.brands}
                  onChange={handleChange}
                  placeholder="Enter brands separated by commas&#10;e.g., HP, Dell, Apple, Lenovo"
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

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
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
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