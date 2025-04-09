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

/**
 * @swagger
 * /statistics/top3-papers-by-author/{author_id}:
 *   get:
 *     summary: Get top 3 papers by an author with the highest views, downloads, and contribution score
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
 *         description: Top 3 papers by the author retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 papers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       paper_id:
 *                         type: string
 *                       title_vn:
 *                         type: string
 *                       title_en:
 *                         type: string
 *                       viewCount:
 *                         type: number
 *                       downloadCount:
 *                         type: number
 *                       contributionScore:
 *                         type: number
 *                       authorDetails:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             author_name_vi:
 *                               type: string
 *                             author_name_en:
 *                               type: string
 *                             role:
 *                               type: string
 *                             point:
 *                               type: number
 *       404:
 *         description: No papers found for this author
 *       500:
 *         description: Internal server error
 */
router.get(
  "/top3-papers-by-author/:author_id",
  statisticsController.getTop3PapersByAuthorId
);

/**
 * @swagger
 * /statistics/total-points-by-author/{author_id}:
 *   get:
 *     summary: Get total points contributed by an author
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
 *         description: Total points contributed by the author retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 author_id:
 *                   type: string
 *                   description: ID of the author
 *                 total_points:
 *                   type: number
 *                   description: Total points contributed by the author
 *       500:
 *         description: Internal server error
 */
router.get(
  "/total-points-by-author/:author_id",
  statisticsController.getTotalPointByAuthorId
);

/**
 * @swagger
 * /statistics/statistics-by-department/{department_id}:
 *   get:
 *     summary: Get statistics for a department
 *     tags: [Statistics]
 *     parameters:
 *       - in: path
 *         name: department_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the department
 *     responses:
 *       200:
 *         description: Statistics for the department retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 department_id:
 *                   type: string
 *                   description: ID of the department
 *                 total_papers:
 *                   type: number
 *                   description: Total number of scientific papers
 *                 total_views:
 *                   type: number
 *                   description: Total views of scientific papers
 *                 total_downloads:
 *                   type: number
 *                   description: Total downloads of scientific papers
 *       500:
 *         description: Internal server error
 */
router.get(
  "/statistics-by-department/:department_id",
  statisticsController.getStatisticsByDepartmentId
);

/**
 * @swagger
 * /statistics/statistics-for-all:
 *   get:
 *     summary: Get statistics for all users (students and lecturers)
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: Statistics for all users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_papers:
 *                   type: number
 *                   description: Total number of scientific papers
 *                 total_views:
 *                   type: number
 *                   description: Total views of scientific papers
 *                 total_downloads:
 *                   type: number
 *                   description: Total downloads of scientific papers
 *       500:
 *         description: Internal server error
 */
router.get("/statistics-for-all", statisticsController.getStatisticsForAll);

/**
 * @swagger
 * /statistics/top3-most-viewed-and-downloaded-papers:
 *   get:
 *     summary: Get top 3 most viewed and downloaded scientific papers
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: Top 3 most viewed and downloaded scientific papers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 papers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       paper_id:
 *                         type: string
 *                       title_vn:
 *                         type: string
 *                       title_en:
 *                         type: string
 *                       cover_image:
 *                         type: string
 *                       department:
 *                         type: string
 *                       viewCount:
 *                         type: number
 *                       downloadCount:
 *                         type: number
 *                       author:
 *                         type: object
 *                         properties:
 *                           author_name_vi:
 *                             type: string
 *                           author_name_en:
 *                             type: string
 *                           role:
 *                             type: string
 *       404:
 *         description: No scientific papers found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/top3-most-viewed-and-downloaded-papers",
  statisticsController.getTop3MostViewedAndDownloadedPapers
);

/**
 * @swagger
 * /statistics/top3-papers-by-department/{department_id}:
 *   get:
 *     summary: Get top 3 papers by a department with the highest views and downloads
 *     tags: [Statistics]
 *     parameters:
 *       - in: path
 *         name: department_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the department
 *     responses:
 *       200:
 *         description: Top 3 papers by the department retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 papers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       paper_id:
 *                         type: string
 *                       title_vn:
 *                         type: string
 *                       title_en:
 *                         type: string
 *                       viewCount:
 *                         type: number
 *                       downloadCount:
 *                         type: number
 *                       authorDetails:
 *                         type: object
 *                         properties:
 *                           author_name_vi:
 *                             type: string
 *                           author_name_en:
 *                             type: string
 *                           role:
 *                             type: string
 *       404:
 *         description: No papers found for this department
 *       500:
 *         description: Internal server error
 */
router.get(
  "/top3-papers-by-department/:department_id",
  statisticsController.getTop3MostViewedAndDownloadedPapersByDepartment
);

/**
 * @swagger
 * /statistics/total-points-by-department/{department_id}:
 *   get:
 *     summary: Get total points contributed by authors in a department
 *     tags: [Statistics]
 *     parameters:
 *       - in: path
 *         name: department_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the department
 *     responses:
 *       200:
 *         description: Total points contributed by authors retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 department_id:
 *                   type: string
 *                   description: ID of the department
 *                 total_points:
 *                   type: number
 *                   description: Total points contributed by authors
 *       500:
 *         description: Internal server error
 */
router.get(
  "/total-points-by-department/:department_id",
  statisticsController.getTotalPointsByDepartmentId
);

module.exports = router;
