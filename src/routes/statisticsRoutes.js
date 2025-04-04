const express = require("express");
const router = express.Router();
const statisticsController = require("../controller/statisticsController");

/**
 * @swagger
 * /statistics/total-by-author/{author_id}:
 *   get:
 *     summary: Get total number of scientific papers by an author
 *     tags: [Statistics]
 *     parameters:
 *       - in: path
 *         name: author_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the author
 *     responses:
 *       200:
 *         description: Total number of scientific papers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 author_id:
 *                   type: string
 *                   description: ID of the author
 *                 total_papers:
 *                   type: number
 *                   description: Total number of scientific papers
 *       500:
 *         description: Internal server error
 */
router.get(
  "/total-by-author/:author_id",
  statisticsController.getTotalPapersByAuthorId
);

/**
 * @swagger
 * /statistics/total-views-by-author/{author_id}:
 *   get:
 *     summary: Get total views of scientific papers by an author
 *     tags: [Statistics]
 *     parameters:
 *       - in: path
 *         name: author_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the author
 *     responses:
 *       200:
 *         description: Total views of scientific papers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 author_id:
 *                   type: string
 *                   description: ID of the author
 *                 total_views:
 *                   type: number
 *                   description: Total views of the author's scientific papers
 *       500:
 *         description: Internal server error
 */
router.get(
  "/total-views-by-author/:author_id",
  statisticsController.getTotalViewsByAuthorId
);

/**
 * @swagger
 * /statistics/total-downloads-by-author/{author_id}:
 *   get:
 *     summary: Get total downloads of scientific papers by an author
 *     tags: [Statistics]
 *     parameters:
 *       - in: path
 *         name: author_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the author
 *     responses:
 *       200:
 *         description: Total downloads of scientific papers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 author_id:
 *                   type: string
 *                   description: ID of the author
 *                 total_downloads:
 *                   type: number
 *                   description: Total downloads of the author's scientific papers
 *       500:
 *         description: Internal server error
 */
router.get(
  "/total-downloads-by-author/:author_id",
  statisticsController.getTotalDownloadsByAuthorId
);

module.exports = router;
