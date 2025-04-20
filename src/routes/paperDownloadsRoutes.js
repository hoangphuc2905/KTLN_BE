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
 * /paperdownload:
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
 *               user_type:
 *                 type: string
 *                 description: Type of user for dynamic population
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
 * /paperdownload:
 *   get:
 *     summary: Get all paper downloads
 *     tags: [PaperDownloads]
 *     parameters:
 *       - in: query
 *         name: user_type
 *         schema:
 *           type: string
 *         required: true
 *         description: Type of user for dynamic population
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
 * /paperdownload/{id}:
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
 *       - in: query
 *         name: user_type
 *         schema:
 *           type: string
 *         required: true
 *         description: Type of user for dynamic population
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
 * /paperdownload/{id}:
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
 *       - in: query
 *         name: user_type
 *         schema:
 *           type: string
 *         required: true
 *         description: Type of user for dynamic population
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
 * /paperdownload/{id}:
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

/**
 * @swagger
 * /paperdownload/count/{paper_id}:
 *   get:
 *     summary: Get the download count for a specific paper
 *     tags: [PaperDownloads]
 *     parameters:
 *       - in: path
 *         name: paper_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the paper to get the download count for
 *     responses:
 *       200:
 *         description: Download count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paper_id:
 *                   type: string
 *                 download_count:
 *                   type: number
 *       404:
 *         description: Paper not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/count/:paper_id",
  paperDownloadsController.getDownloadCountByPaperId
);

/**
 * @swagger
 * /paperdownload/user/{user_id}:
 *   get:
 *     summary: Get all paper downloads by a specific user
 *     tags: [PaperDownloads]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to get paper downloads for
 *     responses:
 *       200:
 *         description: List of paper downloads for the user
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
 *                     type: string
 *                   download_time:
 *                     type: string
 *                     format: date
 *       404:
 *         description: No paper downloads found for this user
 *       500:
 *         description: Internal server error
 */
router.get(
  "/user/:user_id",
  paperDownloadsController.getAllPaperDownloadsByUser
);

module.exports = router;
