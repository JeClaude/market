const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Connect to MongoDB
connectDB();

/*
MIDDLEWARE
*/
app.use(cors());
app.use(express.json());

/*
ROUTES
*/
app.use("/api/auth", userRoutes);

module.exports = app;