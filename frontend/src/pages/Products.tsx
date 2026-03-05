import { Link, useSearchParams } from 'react-router-dom';

// Mock products data
const products = [
  { id: 1, name: 'Rice 5kg', price: 10000, category: 'Food' },
  { id: 2, name: 'T-shirt', price: 12000, category: 'Clothing' },
  { id: 3, name: 'Cooking Oil 2L', price: 8000, category: 'Food' },
  { id: 4, name: 'Smartphone', price: 140000, category: 'Electronics' },
  { id: 5, name: 'Beans 1kg', price: 2500, category: 'Food' },
  { id: 6, name: 'Jeans', price: 25000, category: 'Clothing' },
  { id: 7, name: 'Sugar 2kg', price: 4000, category: 'Food' },
  { id: 8, name: 'Headphones', price: 35000, category: 'Electronics' },
];

const Products = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery) ||
    product.category.toLowerCase().includes(searchQuery) ||
    product.price.toString().includes(searchQuery)
  );

  return (
    <div>
      <h1>Products Page</h1>
      {searchQuery && (
        <p>Search results for: "{searchQuery}"</p>
      )}
      
      <div style={{ marginBottom: '20px' }}>
        <Link to="/">← Back to Home</Link>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: '20px' 
      }}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} style={{ border: '1px solid #ccc', padding: '10px' }}>
              <h3>{product.name}</h3>
              <p>Price: {product.price.toLocaleString()} RWF</p>
              <p>Category: {product.category}</p>
              {product.price < 15000 && (
                <span style={{ background: '#4CAF50', color: 'white', padding: '2px 5px', borderRadius: '3px' }}>
                  Under 15,000 RWF
                </span>
              )}
              <div style={{ marginTop: '10px' }}>
                <Link to={`/product/${product.id}`}>View Details</Link>
                <br />
                <button style={{ marginTop: '5px' }}>Add to Cart</button>
              </div>
            </div>
          ))
        ) : (
          <p>No products found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default Products;