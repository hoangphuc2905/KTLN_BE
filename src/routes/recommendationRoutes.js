const express = require("express");
const router = express.Router();
const recommendationController = require("../controller/recommendationController");

/**
 * @swagger
 * /recommendations/{paperId}:
 *   get:
 *     summary: Get recommended scientific papers based on a given paper
 *     tags: [Recommendations]
 *     parameters:
 *       - in: path
 *         name: paperId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the paper to base recommendations on
 *     responses:
 *       200:
 *         description: Successfully retrieved recommended papers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The ID of the recommended paper
 *                       title_vn:
 *                         type: string
 *                         description: The Vietnamese title of the paper
 *                       title_en:
 *                         type: string
 *                         description: The English title of the paper
 *                       similarity:
 *                         type: number
 *                         description: The similarity score between the given paper and the recommended paper
 *       404:
 *         description: Paper not found or no embedding available
 *       500:
 *         description: Internal server error
 */
router.get("/:paperId", recommendationController.getRecommendations);

/**
 * @swagger
 * /recommendations/user-history/{userId}:
 *   get:
 *     summary: Get top 10 recommended papers based on user's views and downloads
 *     tags: [Recommendations]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: Successfully retrieved recommended papers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The ID of the recommended paper
 *                       title_vn:
 *                         type: string
 *                         description: The Vietnamese title of the paper
 *                       title_en:
 *                         type: string
 *                         description: The English title of the paper
 *                       cover_image:
 *                         type: string
 *                         description: The cover image of the paper
 *                       similarity:
 *                         type: number
 *                         description: The similarity score between the user's history and the paper
 *       500:
 *         description: Internal server error
 */
router.get(
  "/user-history/:userId",
  recommendationController.getRecommendationsByUserHistory
);

module.exports = router;
