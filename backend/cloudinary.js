// backend/cloudinary.js
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Verify Cloudinary configuration
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('❌ Cloudinary configuration missing! Please check your environment variables.');
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test Cloudinary connection
cloudinary.api.ping()
  .then(() => console.log('✅ Cloudinary connection successful'))
  .catch(err => {
    console.error('❌ Cloudinary connection failed:', err);
    process.exit(1);
  });

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "SwapIt", // You can name the folder anything
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

module.exports = { cloudinary, storage };
