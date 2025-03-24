const express = require("express");
const router = express.Router();
const { upload } = require("../controller/imageUploadController");
const {
  processImageAndSearch,
} = require("../controller/articleSearchAIController");

/**
 * @swagger
 * /articlesAI/upload:
 *   post:
 *     summary: Upload hình ảnh và tìm kiếm bài báo
 *     tags:
 *       - Articles
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Hình ảnh bìa bài báo
 *     responses:
 *       200:
 *         description: Thành công, trả về kết quả tìm kiếm bài báo
 *       400:
 *         description: Lỗi do không có hình ảnh được tải lên hoặc không tìm thấy văn bản
 *       500:
 *         description: Lỗi xử lý trên server
 */

// Route upload và xử lý hình ảnh
router.post("/upload", upload, processImageAndSearch);

module.exports = router;
