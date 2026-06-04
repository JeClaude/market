const express = require("express");
const Cart = require("../models/cart");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET current user's cart
router.get("/", authMiddleware, async (req, res) => {
  try {
    const   cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    if (!cart) return res.status(200).json({ items: [] });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST add or update item in cart
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) return res.status(400).json({ message: "Product and quantity required" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      // Create cart if it doesn't exist
      cart = new Cart({
        user: req.user.id,
        items: [{ product: productId, quantity }]
      });
    } else {
      // Check if product already in cart
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity; // increment quantity
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    const populatedCart = await cart.populate("items.product");
    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update quantity for a specific product
router.put("/:productId", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) return res.status(400).json({ message: "Quantity must be at least 1" });

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ message: "Product not in cart" });

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    const populatedCart = await cart.populate("items.product");
    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE remove a product from cart
router.delete("/:productId", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    const populatedCart = await cart.populate("items.product");
    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;