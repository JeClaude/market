const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
  try {

    const { firstname, lastname, phone, email, password } = req.body;

    if (!firstname || !lastname || !phone || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstname,
      lastname,
      phone,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: newUser
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;