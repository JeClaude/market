const express = require("express");
const Category = require("../models/Category");

const router = express.Router();

/*
GET ALL CATEGORIES
*/
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
GET SINGLE CATEGORY BY ID
*/
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({
      success: true,
      category
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
GET SINGLE CATEGORY BY KEY
*/
router.get("/key/:key", async (req, res) => {
  try {
    const category = await Category.findOne({ key: req.params.key });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({
      success: true,
      category
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
CREATE NEW CATEGORY
*/
router.post("/", async (req, res) => {
  try {
    const { key, name, subcategories, brands, icon, order } = req.body;
    
    // Validate required fields
    if (!key || !name) {
      return res.status(400).json({ 
        message: "Key and name are required" 
      });
    }
    
    // Check if category already exists
    const existingCategory = await Category.findOne({ key });
    if (existingCategory) {
      return res.status(400).json({ 
        message: "Category with this key already exists" 
      });
    }
    
    const category = new Category({
      key,
      name,
      subcategories: subcategories || [],
      brands: brands || [],
      icon: icon || "",
      order: order || 0
    });
    
    const savedCategory = await category.save();
    res.status(201).json({
      success: true,
      category: savedCategory
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
UPDATE CATEGORY
*/
router.put("/:id", async (req, res) => {
  try {
    const { key, name, subcategories, brands, icon, isActive, order } = req.body;
    
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    if (key !== undefined) category.key = key;
    if (name !== undefined) category.name = name;
    if (subcategories !== undefined) category.subcategories = subcategories;
    if (brands !== undefined) category.brands = brands;
    if (icon !== undefined) category.icon = icon;
    if (isActive !== undefined) category.isActive = isActive;
    if (order !== undefined) category.order = order;
    
    const updatedCategory = await category.save();
    res.status(200).json({
      success: true,
      category: updatedCategory
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
DELETE CATEGORY
*/
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.status(200).json({
      success: true,
      message: "Category deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;