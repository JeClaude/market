import { useParams, Link } from 'react-router-dom';

// Mock products data (same as above)
const products = [
  { id: 1, name: 'Product 1', price: 10000, category: 'Electronics', description: 'This is product 1 description', inStock: true },
  { id: 2, name: 'Product 2', price: 12000, category: 'Clothing', description: 'This is product 2 description', inStock: true },
  { id: 3, name: 'Product 3', price: 8000, category: 'Food', description: 'This is product 3 description', inStock: false },
  { id: 4, name: 'Product 4', price: 14000, category: 'Electronics', description: 'This is product 4 description', inStock: true },
];

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div>
        <h2>Product not found</h2>
        <Link to="/products">Back to Products</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Product Details</h1>
      <Link to="/products">← Back to Products</Link>
      
      <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '20px' }}>
        <h2>{product.name}</h2>
        <p><strong>Price:</strong> {product.price} RWF</p>
        <p><strong>Category:</strong> {product.category}</p>
        <p><strong>Description:</strong> {product.description}</p>
        <p><strong>Status:</strong> {product.inStock ? 'In Stock' : 'Out of Stock'}</p>
        <button disabled={!product.inStock}>
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;