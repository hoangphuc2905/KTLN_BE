const express = require("express");
const router = express.Router();
const { upload, uploadImage } = require("../controller/imageUploadController");
const {
  processImageAndSearch,
} = require("../controller/articleSearchAIController");
const {
  processArticleFromLink,
} = require("../controller/articleLinkProcessorController");

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
router.post("/upload", upload, processImageAndSearch);

/**
 * @swagger
 * /articlesAI/uploadimage:
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
router.post("/uploadimage", upload, uploadImage, processImageAndSearch);

/**
 * @swagger
 * /articlesAI/link:
 *   post:
 *     summary: Nhập liên kết bài báo và lấy thông tin bài báo
 *     tags:
 *       - Articles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               articleUrl:
 *                 type: string
 *                 description: URL của bài báo
 *                 example: "https://example.com/article-link"
 *     responses:
 *       200:
 *         description: Thành công, trả về thông tin bài báo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: Tiêu đề bài báo
 *                 author:
 *                   type: string
 *                   description: Tác giả bài báo
 *                 publishedDate:
 *                   type: string
 *                   description: Ngày xuất bản bài báo
 *                 description:
 *                   type: string
 *                   description: Mô tả bài báo
 *                 sourceUrl:
 *                   type: string
 *                   description: URL nguồn của bài báo
 *       400:
 *         description: Lỗi do không có URL được cung cấp
 *       500:
 *         description: Lỗi xử lý trên server
 */
router.post("/link", processArticleFromLink);

module.exports = router;