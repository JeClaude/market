import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to products page with search query
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav style={{ 
      background: "#1a1a1a", 
      padding: "1rem",
      position: "sticky",
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        {/* Logo/Brand */}
        <Link to="/" style={{ 
          color: "white", 
          textDecoration: "none",
          fontSize: "1.5rem",
          fontWeight: "bold"
        }}>
          Nihemart.rw
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ flex: "0 1 400px" }}>
          <div style={{ display: "flex" }}>
            <input
              type="text"
              placeholder="Search products... (e.g., under 15000 RWF)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "none",
                borderRadius: "4px 0 0 4px",
                fontSize: "1rem"
              }}
            />
            <button
              type="submit"
              style={{
                padding: "0.5rem 1rem",
                background: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "0 4px 4px 0",
                cursor: "pointer",
                fontSize: "1rem"
              }}
            >
              Search
            </button>
          </div>
        </form>

        {/* Right side - Login and Cart */}
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link to="/login" style={{
            color: "white",
            textDecoration: "none",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            background: "transparent",
            border: "1px solid white"
          }}>
            Login
          </Link>
          
          <Link to="/cart" style={{
            color: "white",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem"
          }}>
            <span>🛒</span>
            <span>Cart</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;