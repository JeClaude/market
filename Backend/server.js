const express = require("express");
const os = require("os");
require("dotenv").config();
const cors = require("cors");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoute"); // ✅ import cart route

const app = express();

// Connect to MongoDB
connectDB();

/*
MIDDLEWARE
*/
app.use(cors({
  origin: "https://market-kappa-ivory.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

/*
ROUTES
*/
app.use("/api/auth", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes); // ✅ add cart route

module.exports = app;

// When run directly (e.g., `node server.js`), start the HTTP server.
// This keeps the app export usable for serverless platforms (e.g., Vercel).
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  const server = app.listen(PORT, () => {
    const address = server.address();
    const port = address && address.port ? address.port : PORT;

    const interfaces = os.networkInterfaces();
    const addresses = [];

    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === "IPv4" && !iface.internal) {
          addresses.push(`http://${iface.address}:${port}`);
        }
      }
    }

    console.log(`Server running on port ${port}`);
    console.log(`Local: http://localhost:${port}`);

    if (addresses.length) {
      console.log("Network:");
      for (const addr of addresses) console.log(`  - ${addr}`);
    }
  });
}