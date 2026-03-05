import { Link } from "react-router-dom";

// Simple ProductCard component
const ProductCard = ({ product }: { product: any }) => {
  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}>
      <h3>{product.name}</h3>
      <p>Price: {product.price} RWF</p>
      {product.underFifteenThousand && (
        <span style={{ background: "green", color: "white", padding: "2px 5px", borderRadius: "3px" }}>
          Under 15,000 RWF
        </span>
      )}
      <div style={{ marginTop: "10px" }}>
        <Link to={`/product/${product.id}`}>View Details</Link>
      </div>
    </div>
  );
};

export default ProductCard;