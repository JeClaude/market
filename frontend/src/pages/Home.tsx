import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to Nihemart - Your fast delivery store in Kigali</p>
      <nav>
        <Link to="/products">View Products</Link> | <Link to="/cart">View Cart</Link>
      </nav>
      
      <div style={{ marginTop: "20px" }}>
        <h2>Delivery only 40 mins in Kigali</h2>
        <p>Fast delivery • Secure payment • Refer a friend</p>
      </div>
    </div>
  );
};

export default Home;