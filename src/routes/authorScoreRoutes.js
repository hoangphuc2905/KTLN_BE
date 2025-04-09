const express = require("express");
const router = express.Router();
const {
  calculateScoreFromInput,
} = require("../controller/authorScoreController");

/**
 * @swagger
 * /authorScores/input:
 *   post:
 *     summary: Calculate the scores for authors based on input data
 *     tags: [AuthorScores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *               doi:
 *                 type: boolean
 *               featured:
 *                 type: boolean
 *               article_group:
 *                 type: string
 *               authors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                     degree:
 *                       type: string
 *                     point:
 *                       type: number
 *                     institutions:
 *                       type: array
 *                       items:
 *                         type: string
 *     responses:
 *       200:
 *         description: Scores calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalScore:
 *                   type: number
 *                 authorScores:
 *                   type: object
 *                   additionalProperties:
 *                     type: string
 *       404:
 *         description: No formula found
 *       500:
 *         description: Server error
 */
router.post("/input", calculateScoreFromInput);

module.exports = router;
