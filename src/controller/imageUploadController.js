const multer = require("multer");
const cloudinary = require("../configs/cloudinary"); 

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("image");

const uploadImageToCloudinary = async (buffer, folderName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folderName },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.url); 
        }
      }
    );
    stream.end(buffer);
  });
};

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const folderName = "article_images"; 
    const imageUrl = await uploadImageToCloudinary(req.file.buffer, folderName);

    res.status(200).json({
      message: "Image uploaded successfully",
      url: imageUrl,
    });
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    res.status(500).json({ message: "Error uploading image", error: error.message });
  }
};

module.exports = {
  upload,
  uploadImage,
  uploadImageToCloudinary,
};
