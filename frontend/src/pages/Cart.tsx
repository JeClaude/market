import { Link } from 'react-router-dom';

// Mock cart data
const cartItems = [
  { id: 1, name: 'Product 1', price: 10000, quantity: 2 },
  { id: 2, name: 'Product 2', price: 12000, quantity: 1 },
];

const Cart = () => {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div>
      <h1>Shopping Cart</h1>
      <Link to="/products">← Continue Shopping</Link>

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div style={{ marginTop: '20px' }}>
            {cartItems.map(item => (
              <div key={item.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                <h3>{item.name}</h3>
                <p>Price: {item.price} RWF</p>
                <p>Quantity: {item.quantity}</p>
                <p>Subtotal: {item.price * item.quantity} RWF</p>
                <button>Remove</button>
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <h3>Total: {total} RWF</h3>
            <Link to="/checkout">
              <button style={{ padding: '10px 20px', background: 'green', color: 'white' }}>
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;