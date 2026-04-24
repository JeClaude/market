// models/Product.js
const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    default: 0,
    min: 0
  },
  image: {
    type: String,
    default: ""
  },
  attributes: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { _id: true });

const productSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    sparse: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },
  
  // Pricing
  price: {
    type: Number,
    required: true,
    min: 0
  },
  compareAtPrice: {
    type: Number,
    min: 0,
    default: null
  },
  costPerItem: {
    type: Number,
    min: 0
  },
  
  // Inventory
  quantity: {
    type: Number,
    default: 0,
    min: 0
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  barcode: {
    type: String,
    sparse: true
  },
  trackInventory: {
    type: Boolean,
    default: true
  },
  lowStockThreshold: {
    type: Number,
    default: 5
  },
  
  // Categories & Hierarchy
  category: {
    type: String,
    required: true,
    enum: [
      "computers-laptops",
      "components",
      "printers",
      "networking",
      "home-electronics",
      "security-storage",
      "mobile-accessories",
      "audio-equipment",
      "office-supplies"
    ]
  },
  subcategory: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  
  // Specifications
  specifications: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Images - Local storage paths
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ""
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  image: {
    type: String,
    default: ""
  },
  
  // Variants
  variants: [variantSchema],
  
  // SEO
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  
  // Shipping
  weight: {
    type: Number,
    min: 0
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ["cm", "in"],
      default: "cm"
    }
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Reviews & Ratings
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  
  // Tags
  tags: [String],
  
}, { 
  timestamps: true 
});

// Create slug before saving
productSchema.pre("save", async function() {
  if (this.isModified("name") || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
});

// Indexes for better search performance
productSchema.index({ name: "text", description: "text", brand: "text", tags: "text" });
productSchema.index({ category: 1, brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ createdAt: -1 });

// Virtual for discount percentage
productSchema.virtual("discountPercentage").get(function() {
  if (this.compareAtPrice && this.compareAtPrice > this.price) {
    return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
  }
  return 0;
});

// Virtual for formatted price
productSchema.virtual("formattedPrice").get(function() {
  return `$${this.price.toFixed(2)}`;
});

// Method to check if product is in stock
productSchema.methods.isInStock = function(quantity = 1) {
  if (!this.trackInventory) return true;
  return this.quantity >= quantity;
};

// Method to reduce stock
productSchema.methods.reduceStock = async function(quantity = 1) {
  if (this.trackInventory) {
    this.quantity -= quantity;
    await this.save();
  }
  return this;
};

module.exports = mongoose.model("Product", productSchema);