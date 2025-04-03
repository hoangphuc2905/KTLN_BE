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
 *       500:
 *         description: Internal server error
 */
router.get(
  "/total-by-author/:author_id",
  statisticsController.getTotalPapersByAuthorId
);


module.exports = router;
