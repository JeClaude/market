const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");

const app = express();

/*
MIDDLEWARE
*/
app.use(cors());
app.use(express.json());

/*
ROUTES
*/
app.use("/api/auth", userRoutes);

/*
DATABASE CONNECTION
*/
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Atlas connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// ✅ Export instead of listening
module.exports = app;