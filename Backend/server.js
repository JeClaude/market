const express = require("express");
const cors = require("cors");
const os = require("os");
const path = require("path");  // ← ADD THIS LINE
require("dotenv").config();

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoute");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

// Connect to MongoDB
connectDB();

/*
MIDDLEWARE
*/
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));  // ← MOVE HERE (better position)

/*
ROUTES
*/
app.use("/api/auth", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/categories", categoryRoutes);

module.exports = app;

// When run directly (e.g., `node server.js`), start the HTTP server.
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