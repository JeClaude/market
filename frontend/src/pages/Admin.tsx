import { useState } from "react";
import AdminProducts from "../components/Admin/AdminProducts";
import AdminCategories from "../components/Admin/AdminCategories";

const Admin = () => {
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");

  const navItems = [
    { id: "products", name: "Products", icon: "📦" },
    { id: "categories", name: "Categories", icon: "📁" },
  ];

  return (
    <div className="flex">
      {/* Sidebar - NOT fixed, natural height */}
      <div className="w-64 bg-white shadow-lg">
        
        <nav className="p-4 mt-20">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as "products" | "categories")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                activeTab === item.id
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {activeTab === "products" ? <AdminProducts /> : <AdminCategories />}
      </div>
    </div>
  );
};

export default Admin;