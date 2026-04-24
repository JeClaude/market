const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  },
  subcategories: [{
    type: String,
    trim: true
  }],
  brands: [{
    type: String,
    trim: true
  }],
  icon: {
    type: String,
    default: ""
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Category", categorySchema);