const express = require("express");
const router = express.Router();
const { semanticSearch } = require("../controller/searchAIControllers");

/**
 * @swagger
 * /search/semantic:
 *   post:
 *     summary: Perform semantic search on scientific papers
 *     tags: [Search]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *                 description: The search query
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 query:
 *                   type: string
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       paper:
 *                         type: object
 *                         description: The scientific paper details
 *                       score:
 *                         type: number
 *                         description: Semantic similarity score
 *       400:
 *         description: Missing query
 *       500:
 *         description: Server error
 */
router.post("/semantic", semanticSearch);

module.exports = router;
