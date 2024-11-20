const multer = require("multer");
const path = require("path");

// Define the storage configuration for multer
const storage = multer.diskStorage({
  // Specify the destination folder to save uploaded files
  destination: (req, file, cb) => {
    // This will save uploaded files in the src/uploads folder
    cb(null, path.join(__dirname, "../../uploads")); // Use path.join to handle cross-platform paths
  },
  // Specify the filename format
  filename: (req, file, cb) => {
    // Generate a unique filename using the current timestamp and original file extension
    cb(
      null,
      `${Date.now()}-${file.fieldname}${path.extname(file.originalname)}`
    );
  },
});

// Define the file filter to restrict file types (only images allowed)
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Unsupported file type"), false); // Reject unsupported file types
  }
};

// Initialize multer with storage, file size limit, and file filter
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
  fileFilter,
});

// Export the upload middleware so it can be used in other files
module.exports = upload;
