const express = require("express");
const router = express.Router();
const paperDownloadsController = require("../controller/paperDownloadsController");

/**
 * @swagger
 * tags:
 *   name: PaperDownloads
 *   description: Paper downloads management endpoints
 */

/**
 * @swagger
 * /paperDownloads:
 *   post:
 *     summary: Create a new paper download
 *     tags: [PaperDownloads]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               download_id:
 *                 type: string
 *               paper_id:
 *                 type: string
 *               user_id:
 *                 type: array
 *                 items:
 *                   type: string
 *               download_time:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Paper download created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", paperDownloadsController.createPaperDownload);

/**
 * @swagger
 * /paperDownloads:
 *   get:
 *     summary: Get all paper downloads
 *     tags: [PaperDownloads]
 *     responses:
 *       200:
 *         description: List of paper downloads
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   download_id:
 *                     type: string
 *                   paper_id:
 *                     type: string
 *                   user_id:
 *                     type: array
 *                     items:
 *                       type: string
 *                   download_time:
 *                     type: string
 *                     format: date
 */
router.get("/", paperDownloadsController.getAllPaperDownloads);

/**
 * @swagger
 * /paperDownloads/{id}:
 *   get:
 *     summary: Get a paper download by ID
 *     tags: [PaperDownloads]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The paper download ID
 *     responses:
 *       200:
 *         description: Paper download details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 download_id:
 *                   type: string
 *                 paper_id:
 *                   type: string
 *                 user_id:
 *                   type: array
 *                   items:
 *                     type: string
 *                 download_time:
 *                   type: string
 *                   format: date
 *       404:
 *         description: Paper download not found
 */
router.get("/:id", paperDownloadsController.getPaperDownloadById);

/**
 * @swagger
 * /paperDownloads/{id}:
 *   put:
 *     summary: Update a paper download by ID
 *     tags: [PaperDownloads]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The paper download ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               download_id:
 *                 type: string
 *               paper_id:
 *                 type: string
 *               user_id:
 *                 type: array
 *                 items:
 *                   type: string
 *               download_time:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Paper download updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Paper download not found
 */
router.put("/:id", paperDownloadsController.updatePaperDownloadById);

/**
 * @swagger
 * /paperDownloads/{id}:
 *   delete:
 *     summary: Delete a paper download by ID
 *     tags: [PaperDownloads]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The paper download ID
 *     responses:
 *       200:
 *         description: Paper download deleted successfully
 *       404:
 *         description: Paper download not found
 */
router.delete("/:id", paperDownloadsController.deletePaperDownloadById);

module.exports = router;
