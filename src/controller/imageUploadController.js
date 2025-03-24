const multer = require("multer");

// Cấu hình Multer (lưu vào bộ nhớ tạm)
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("image");

module.exports = {
  upload,
};
