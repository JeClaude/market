const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const productsDir = path.join(__dirname, "../uploads/products");

// Ensure directory exists
if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true });
}

class ImageService {
  // Process and save image
  static async processAndSaveImage(tempPath, productId, options = {}) {
    try {
      const {
        width = 800,
        height = 800,
        quality = 80,
        format = "webp"
      } = options;

      // Generate unique filename
      const filename = `${productId}-${uuidv4()}.${format}`;
      const outputPath = path.join(productsDir, filename);

      // Process image with sharp
      let image = sharp(tempPath);
      
      // Resize image
      image = image.resize(width, height, {
        fit: "cover",
        position: "center"
      });
      
      // Convert format and save
      await image
        .toFormat(format, { quality: quality })
        .toFile(outputPath);

      // Delete temporary file
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }

      // Return the URL path
      return `/uploads/products/${filename}`;
    } catch (error) {
      console.error("Error processing image:", error);
      throw error;
    }
  }

  // Delete image
  static async deleteImage(imageUrl) {
    try {
      if (!imageUrl) return;
      
      const filename = path.basename(imageUrl);
      const imagePath = path.join(productsDir, filename);
      
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  }
}

module.exports = ImageService;