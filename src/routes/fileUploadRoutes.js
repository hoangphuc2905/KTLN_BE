const express = require("express");
const router = express.Router();
const {
  upload,
  uploadFile,
} = require("../controller/fileCloudinaryController");

/**
 * @swagger
 * /files/upload:
 *   post:
 *     summary: Upload a file to Cloudinary
 *     tags:
 *       - File Upload
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File uploaded successfully
 *                 url:
 *                   type: string
 *                   example: https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Error uploading file
 */
router.post("/upload", upload, uploadFile);

module.exports = router;
