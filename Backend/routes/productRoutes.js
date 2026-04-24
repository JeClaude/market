// routes/products.js
const express = require("express");
const Product = require("../models/Product");
const upload = require("../middleware/upload");
const ImageService = require("../services/imageService");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Serve static files from uploads directory
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

/*
UPLOAD SINGLE PRODUCT IMAGE
*/
router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }
    
    const tempPath = req.file.path;
    const productId = req.body.productId || Date.now().toString();
    
    // Process and save image
    const imageUrl = await ImageService.processAndSaveImage(tempPath, productId, {
      width: 800,
      height: 800,
      quality: 80,
      format: "webp"
    });
    
    // Delete temp file
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    
    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: imageUrl
    });
  } catch (error) {
    // Clean up temp file if exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message });
  }
});

/*
UPLOAD MULTIPLE PRODUCT IMAGES
*/
router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }
    
    const tempPath = req.file.path;
    const productId = req.body.productId || Date.now().toString();
    
    // Process and save image
    const imageUrl = await ImageService.processAndSaveImage(tempPath, productId, {
      width: 800,
      height: 800,
      quality: 80,
      format: "webp"
    });
    
    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: imageUrl
    });
  } catch (error) {
    // Clean up temp file if exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message });
  }
});

/*
GET ALL PRODUCTS with filtering, sorting, and pagination
*/
router.get("/", async (req, res) => {
  try {
    const {
      category,
      subcategory,
      brand,
      minPrice,
      maxPrice,
      search,
      isFeatured,
      isActive,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 20
    } = req.query;

    // Build query
    let query = {};
    
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (brand) query.brand = brand;
    if (isFeatured !== undefined) query.isFeatured = isFeatured === "true";
    if (isActive !== undefined) query.isActive = isActive === "true";
    
    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    // Search
    if (search) {
      query.$text = { $search: search };
    }
    
    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Sorting
    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };
    
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Product.countDocuments(query);
    
    res.status(200).json({
      success: true,
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
GET SINGLE PRODUCT
*/
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
GET PRODUCT BY SLUG
*/
router.get("/slug/:slug", async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
CREATE NEW PRODUCT
*/
router.post("/", async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      quantity,
      category,
      subcategory,
      brand,
      sku,
      compareAtPrice,
      isFeatured,
      specifications,
      variants,
      images,
      shortDescription,
      seo,
      tags
    } = req.body;
    
    // Validate required fields
    if (!name || !price || !category) {
      return res.status(400).json({ 
        message: "Name, price, and category are required" 
      });
    }
    
    // Parse images if sent as JSON string
    let parsedImages = images;
    if (typeof images === "string") {
      parsedImages = JSON.parse(images);
    }
    
    // Ensure images have proper structure
    const productImages = (parsedImages || []).map((img, index) => ({
      url: img.url || img,
      alt: img.alt || name,
      isPrimary: img.isPrimary || index === 0
    }));
    
    const product = new Product({
      name,
      price,
      description: description || "",
      quantity: quantity || 0,
      category,
      subcategory,
      brand,
      sku,
      compareAtPrice: compareAtPrice || null,
      isFeatured: isFeatured || false,
      specifications: specifications || {},
      variants: variants || [],
      images: productImages,
      image: productImages[0]?.url || "",
      shortDescription: shortDescription || description?.substring(0, 200),
      seo: seo || {},
      tags: tags || []
    });
    
    const savedProduct = await product.save();
    res.status(201).json({
      success: true,
      product: savedProduct
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
UPDATE PRODUCT
*/
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    const {
      name,
      price,
      description,
      quantity,
      category,
      subcategory,
      brand,
      sku,
      compareAtPrice,
      isFeatured,
      specifications,
      variants,
      images,
      shortDescription,
      seo,
      tags,
      isActive
    } = req.body;
    
    // Parse images if sent as JSON string
    let parsedImages = images;
    if (typeof images === "string") {
      parsedImages = JSON.parse(images);
    }
    
    // Check for images to delete (if they were removed)
    const oldImageUrls = product.images.map(img => img.url);
    const newImageUrls = (parsedImages || []).map(img => img.url || img);
    
    const imagesToDelete = oldImageUrls.filter(url => !newImageUrls.includes(url));
    
    // Delete removed images from server
    if (imagesToDelete.length > 0) {
      await ImageService.deleteImages(imagesToDelete);
    }
    
    // Prepare new images array
    const productImages = (parsedImages || []).map((img, index) => ({
      url: img.url || img,
      alt: img.alt || name || product.name,
      isPrimary: img.isPrimary || index === 0
    }));
    
    // Update fields
    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (description !== undefined) product.description = description;
    if (quantity !== undefined) product.quantity = quantity;
    if (category !== undefined) product.category = category;
    if (subcategory !== undefined) product.subcategory = subcategory;
    if (brand !== undefined) product.brand = brand;
    if (sku !== undefined) product.sku = sku;
    if (compareAtPrice !== undefined) product.compareAtPrice = compareAtPrice;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;
    if (specifications !== undefined) product.specifications = specifications;
    if (variants !== undefined) product.variants = variants;
    if (parsedImages !== undefined) product.images = productImages;
    if (shortDescription !== undefined) product.shortDescription = shortDescription;
    if (seo !== undefined) product.seo = seo;
    if (tags !== undefined) product.tags = tags;
    if (isActive !== undefined) product.isActive = isActive;
    
    // Update main image
    product.image = productImages[0]?.url || "";
    
    const updatedProduct = await product.save();
    res.status(200).json({
      success: true,
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
DELETE PRODUCT
*/
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    // Delete all associated images
    const imageUrls = product.images.map(img => img.url);
    if (imageUrls.length > 0) {
      await ImageService.deleteImages(imageUrls);
    }
    
    // Delete variants images if any
    for (const variant of product.variants) {
      if (variant.image) {
        await ImageService.deleteImage(variant.image);
      }
    }
    
    await Product.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ 
      success: true,
      message: "Product deleted successfully", 
      product 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
PATCH PRODUCT (Partial Update)
*/
router.patch("/:id", async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = [
      "name", "price", "image", "description", "quantity", "category",
      "subcategory", "brand", "sku", "compareAtPrice", "isFeatured",
      "specifications", "variants", "images", "shortDescription", "seo",
      "tags", "isActive", "trackInventory", "lowStockThreshold"
    ];
    
    const isValidOperation = Object.keys(updates).every(update => 
      allowedUpdates.includes(update)
    );
    
    if (!isValidOperation) {
      return res.status(400).json({ message: "Invalid updates" });
    }
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    Object.keys(updates).forEach(update => {
      product[update] = updates[update];
    });
    
    const updatedProduct = await product.save();
    res.status(200).json({
      success: true,
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
GET PRODUCT STATISTICS
*/
router.get("/stats/overview", async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const featuredProducts = await Product.countDocuments({ isFeatured: true });
    
    const lowStock = await Product.countDocuments({
      trackInventory: true,
      $expr: { $lte: ["$quantity", "$lowStockThreshold"] }
    });
    
    const outOfStock = await Product.countDocuments({
      trackInventory: true,
      quantity: 0
    });
    
    const categoryCount = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const brandCount = await Product.aggregate([
      { $match: { isActive: true, brand: { $exists: true, $ne: null } } },
      { $group: { _id: "$brand", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    const priceRange = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          avgPrice: { $avg: "$price" }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        activeProducts,
        featuredProducts,
        lowStock,
        outOfStock,
        categoryCount,
        brandCount,
        priceRange: priceRange[0] || { minPrice: 0, maxPrice: 0, avgPrice: 0 }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
BULK UPDATE PRODUCTS
*/
router.post("/bulk-update", async (req, res) => {
  try {
    const { productIds, updates } = req.body;
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: "Product IDs are required" });
    }
    
    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: updates }
    );
    
    res.status(200).json({
      success: true,
      message: "Products updated successfully",
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
GET PRODUCTS BY CATEGORY
*/
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 20, page = 1 } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const products = await Product.find({ 
      category, 
      isActive: true 
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Product.countDocuments({ category, isActive: true });
    
    res.status(200).json({
      success: true,
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
GET FEATURED PRODUCTS
*/
router.get("/featured/all", async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    
    const products = await Product.find({ 
      isFeatured: true, 
      isActive: true 
    })
      .sort({ createdAt: -1 })
      .limit(Number(limit));
    
    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;