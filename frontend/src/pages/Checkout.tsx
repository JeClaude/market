import { Link } from 'react-router-dom';

const Checkout = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Order placed! (This is a demo)');
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Link to="/cart">← Back to Cart</Link>

      <form onSubmit={handleSubmit} style={{ marginTop: '20px', maxWidth: '500px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Full Name:</label>
          <input type="text" required style={{ width: '100%', padding: '8px' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Phone Number:</label>
          <input type="tel" required style={{ width: '100%', padding: '8px' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Delivery Address in Kigali:</label>
          <textarea required rows={3} style={{ width: '100%', padding: '8px' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Payment Method:</label>
          <select style={{ width: '100%', padding: '8px' }}>
            <option>Cash on Delivery</option>
            <option>Mobile Money (MoMo)</option>
            <option>Credit Card</option>
          </select>
        </div>

        <button type="submit" style={{ padding: '10px 20px', background: 'blue', color: 'white' }}>
          Place Order
        </button>
      </form>
    </div>
  );
};

export default Checkout;