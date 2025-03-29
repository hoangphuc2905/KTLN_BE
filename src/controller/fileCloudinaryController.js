const multer = require("multer");
const cloudinary = require("../configs/cloudinary"); // Đường dẫn đến file cấu hình Cloudinary

// Cấu hình Multer (lưu vào bộ nhớ tạm)
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("file"); // Đặt key là "file" cho file tải lên

// Hàm upload file lên Cloudinary
const uploadFileToCloudinary = async (buffer, folderName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folderName },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.url); // Trả về URL của file đã tải lên
        }
      }
    );
    stream.end(buffer);
  });
};

// Controller xử lý upload file
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const folderName = "scientific_papers"; // Tên thư mục trên Cloudinary
    const fileUrl = await uploadFileToCloudinary(req.file.buffer, folderName);

    res.status(200).json({
      message: "File uploaded successfully",
      url: fileUrl,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res
      .status(500)
      .json({ message: "Error uploading file", error: error.message });
  }
};

module.exports = {
  upload,
  uploadFile,
};
