const express = require("express");
const router = express.Router();
const statisticsController = require("../controller/statisticsController");

/**
 * @swagger
 * /statistics/total-by-author/{author_id}:
 *   get:
 *     summary: Get total number of approved papers by author ID, optionally filtered by academic year
 *     tags: [Statistics]
 *     parameters:
 *       - in: path
 *         name: author_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the author
 *       - in: query
 *         name: academicYear
 *         schema:
 *           type: string
 *           example: "2024-2025"
 *         required: false
 *         description: The academic year to filter papers (e.g., "2024-2025")
 *     responses:
 *       200:
 *         description: Total number of approved papers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 author_id:
 *                   type: string
 *                   description: The ID of the author
 *                 academicYear:
 *                   type: string
 *                   description: The academic year filter applied
 *                   example: "2024-2025"
 *                 total_papers:
 *                   type: number
 *                   description: Total number of approved papers
 *       500:
 *         description: Internal server error
 */
router.get("/total-by-author/:author_id", statisticsController.getTotalPapersByAuthorId);

/**
 * @swagger
 * /statistics/total-views-by-author/{author_id}:
 *   get:
 *     summary: Get total number of views by author ID, optionally filtered by academic year
 *     tags: [Statistics]
 *     parameters:
 *       - in: path
 *         name: author_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the author
 *       - in: query
 *         name: academicYear
 *         schema:
 *           type: string
 *           example: "2024-2025"
 *         required: false
 *         description: The academic year to filter views (e.g., "2024-2025")
 *     responses:
 *       200:
 *         description: Total number of views retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 author_id:
 *                   type: string
 *                   description: The ID of the author
 *                 academicYear:
 *                   type: string
 *                   description: The academic year filter applied
 *                   example: "2024-2025"
 *                 total_views:
 *                   type: number
 *                   description: Total number of views
 *       500:
 *         description: Internal server error
 */
router.get("/total-views-by-author/:author_id", statisticsController.getTotalViewsByAuthorId);

/**
 * @swagger
 * /statistics/total-downloads-by-author/{author_id}:
 *   get:
 *     summary: Get total downloads of scientific papers by an author, optionally filtered by academic year
 *     tags: [Statistics]
 *     parameters:
 *       - in: path
 *         name: author_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the author
 *       - in: query
 *         name: academicYear
 *         schema:
 *           type: string
 *           example: "2024-2025"
 *         required: false
 *         description: The academic year to filter downloads (e.g., "2024-2025")
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
 *                   description: The ID of the author
 *                 academicYear:
 *                   type: string
 *                   description: The academic year filter applied
 *                   example: "2024-2025"
 *                 total_downloads:
 *                   type: number
 *                   description: Total downloads of the author's scientific papers
 *       500:
 *         description: Internal server error
 */
router.get("/total-downloads-by-author/:author_id", statisticsController.getTotalDownloadsByAuthorId);

/**
 * @swagger
 * /statistics/top5-papers-by-author/{author_id}:
 *   get:
 *     summary: Get top 5 papers by an author with the highest views, downloads, and contribution score, optionally filtered by academic year
 *     tags: [Statistics]
 *     parameters:
 *       - in: path
 *         name: author_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the author
 *       - in: query
 *         name: academicYear
 *         schema:
 *           type: string
 *           example: "2024-2025"
 *         required: false
 *         description: The academic year to filter papers (e.g., "2024-2025")
 *     responses:
 *       200:
 *         description: Top 5 papers by the author retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 academicYear:
 *                   type: string
 *                   description: The academic year filter applied
 *                   example: "2024-2025"
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
 *                             user_id:
 *                               type: string
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
router.get("/top5-papers-by-author/:author_id", statisticsController.getTop5PapersByAuthorId);

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
router.get("/total-points-by-author/:author_id", statisticsController.getTotalPointByAuthorId);

/**
 * @swagger
 * /statistics/statistics-by-department/{department_id}:
 *   get:
 *     summary: Get statistics for a specific department, optionally filtered by academic year
 *     tags: [Statistics]
 *     parameters:
 *       - in: path
 *         name: department_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the department
 *       - in: query
 *         name: academicYear
 *         schema:
 *           type: string
 *           example: "2023-2024"
 *         required: false
 *         description: The academic year to filter statistics (e.g., "2023-2024")
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
 *                 academicYear:
 *                   type: string
 *                   description: The academic year filter applied
 *                   example: "2023-2024"
 *                 total_papers:
 *                   type: number
 *                 total_views:
 *                   type: number
 *                 total_downloads:
 *                   type: number
 *       500:
 *         description: Internal server error
 */
router.get("/statistics-by-department/:department_id", statisticsController.getStatisticsByDepartmentId);

/**
 * @swagger
 * /statistics/statistics-for-all:
 *   get:
 *     summary: Get statistics for all users (students and lecturers), optionally filtered by academic year
 *     tags: [Statistics]
 *     parameters:
 *       - in: query
 *         name: academicYear
 *         schema:
 *           type: string
 *           example: "2024-2025"
 *         required: false
 *         description: The academic year to filter statistics (e.g., "2024-2025")
 *     responses:
 *       200:
 *         description: Statistics for all users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 academicYear:
 *                   type: string
 *                   description: The academic year filter applied
 *                   example: "2024-2025"
 *                 total_papers:
 *                   type: number
 *                   description: Total number of approved papers
 *                 total_views:
 *                   type: number
 *                   description: Total number of views
 *                 total_downloads:
 *                   type: number
 *                   description: Total number of downloads
 *       500:
 *         description: Internal server error
 */
router.get("/statistics-for-all", statisticsController.getStatisticsForAll);

/**
 * @swagger
 * /statistics/top5-most-viewed-and-downloaded-papers:
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
router.get("/top5-most-viewed-and-downloaded-papers", statisticsController.getTop5MostViewedAndDownloadedPapers);

/**
 * @swagger
 * /statistics/top5-papers-by-department/{department_id}:
 *   get:
 *     summary: Get top 5 most viewed and downloaded scientific papers by department, optionally filtered by academic year
 *     tags: [Statistics]
 *     parameters:
 *       - in: path
 *         name: department_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the department
 *       - in: query
 *         name: academicYear
 *         schema:
 *           type: string
 *           example: "2023-2024"
 *         required: false
 *         description: The academic year to filter statistics (e.g., "2023-2024")
 *     responses:
 *       200:
 *         description: Top 5 most viewed and downloaded scientific papers by department retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 academicYear:
 *                   type: string
 *                   description: The academic year filter applied
 *                   example: "2023-2024"
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
 *         description: No scientific papers found for this department
 *       500:
 *         description: Internal server error
 */
router.get("/top5-papers-by-department/:department_id", statisticsController.getTop5MostViewedAndDownloadedPapersByDepartment);

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
router.get("/total-points-by-department/:department_id", statisticsController.getTotalPointsByDepartmentId);

/**
 * @swagger
 * /statistics/by-all-group:
 *   get:
 *     summary: Get statistics grouped by article group, optionally filtered by academic year
 *     tags: [Statistics]
 *     parameters:
 *       - in: query
 *         name: academicYear
 *         schema:
 *           type: string
 *           example: "2024-2025"
 *         required: false
 *         description: The academic year to filter statistics (e.g., "2024-2025")
 *     responses:
 *       200:
 *         description: Statistics by group retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 academicYear:
 *                   type: string
 *                   description: The academic year filter applied
 *                   example: "2024-2025"
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *       500:
 *         description: Internal server error
 */
router.get("/by-all-group", statisticsController.getStatisticsByAllGroup);

/**
 * @swagger
 * /statistics/top5-by-all-group:
 *   get:
 *     summary: Get top 5 departments by approved papers, optionally filtered by academic year
 *     tags: [Statistics]
 *     parameters:
 *       - in: query
 *         name: academicYear
 *         schema:
 *           type: string
 *           example: "2024-2025"
 *         required: false
 *         description: The academic year to filter statistics (e.g., "2024-2025")
 *     responses:
 *       200:
 *         description: Top 5 departments by approved papers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 academicYear:
 *                   type: string
 *                   description: The academic year filter applied
 *                   example: "2024-2025"
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *       500:
 *         description: Internal server error
 */
router.get("/top5-by-all-group", statisticsController.getStatisticsTop5ByAllDepartment);

/**
 * @swagger
 * /statistics/top5-by-type:
 *   get:
 *     summary: Get top 5 types of papers by count, optionally filtered by academic year
 *     tags: [Statistics]
 *     parameters:
 *       - in: query
 *         name: academicYear
 *         schema:
 *           type: string
 *           example: "2024-2025"
 *         required: false
 *         description: The academic year to filter statistics (e.g., "2024-2025")
 *     responses:
 *       200:
 *         description: Top 5 types by approved papers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 academicYear:
 *                   type: string
 *                   description: The academic year filter applied
 *                   example: "2024-2025"
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *       500:
 *         description: Internal server error
 */
router.get("/top5-by-type", statisticsController.getStatisticsTop5ByType);

/**
 * @swagger
 * /statistics/group-by-department/{department_id}:
 *   get:
 *     summary: Get statistics by group for a specific department, optionally filtered by academic year
 *     tags: [Statistics]
 *     parameters:
 *       - in: path
 *         name: department_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the department
 *       - in: query
 *         name: academicYear
 *         schema:
 *           type: string
 *           example: "2023-2024"
 *         required: false
 *         description: The academic year to filter statistics (e.g., "2023-2024")
 *     responses:
 *       200:
 *         description: Statistics by group for the department retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 academicYear:
 *                   type: string
 *                   description: The academic year filter applied
 *                   example: "2023-2024"
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *       500:
 *         description: Internal server error
 */
router.get("/group-by-department/:department_id", statisticsController.getStatisticsByGroupByDepartment);
/**
 * @swagger
 * /statistics/top5-authors-by-department/{department_id}:
 *   get:
 *     summary: Get top 5 authors by total points in a specific department, optionally filtered by academic year
 *     tags: [Statistics]
 *     parameters:
 *       - in: path
 *         name: department_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the department
 *       - in: query
 *         name: academicYear
 *         schema:
 *           type: string
 *           example: "2023-2024"
 *         required: false
 *         description: The academic year to filter statistics (e.g., "2023-2024")
 *     responses:
 *       200:
 *         description: Top 5 authors by total points retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 academicYear:
 *                   type: string
 *                   description: The academic year filter applied
 *                   example: "2023-2024"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       author_id:
 *                         type: string
 *                       authorName:
 *                         type: string
 *                       degree:
 *                         type: string
 *                       totalPoints:
 *                         type: number
 *       500:
 *         description: Internal server error
 */
router.get("/top5-authors-by-department/:department_id", statisticsController.getTop5AuthorsByDepartment);

/**
 * @swagger
 * /statistics/top5-by-type-by-department/{department_id}:
 *   get:
 *     summary: Get top 5 paper types by approved papers for a specific department, optionally filtered by academic year
 *     tags: [Statistics]
 *     parameters:
 *       - in: path
 *         name: department_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the department
 *       - in: query
 *         name: academicYear
 *         schema:
 *           type: string
 *           example: "2023-2024"
 *         required: false
 *         description: The academic year to filter statistics (e.g., "2023-2024")
 *     responses:
 *       200:
 *         description: Top 5 paper types by approved papers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 academicYear:
 *                   type: string
 *                   description: The academic year filter applied
 *                   example: "2023-2024"
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *       500:
 *         description: Internal server error
 */
router.get("/top5-by-type-by-department/:department_id", statisticsController.getStatisticsTop5ByTypeByDepartment);

/**
 * @swagger
 * /statistics/paper-group-by-user/{user_id}:
 *   get:
 *     summary: Get top 5 paper groups for a specific user, optionally filtered by academic year
 *     tags: [Statistics]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *       - in: query
 *         name: academicYear
 *         schema:
 *           type: string
 *           example: "2024-2025"
 *         required: false
 *         description: The academic year to filter papers (e.g., "2024-2025")
 *     responses:
 *       200:
 *         description: Top 5 paper groups for the user retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 academicYear:
 *                   type: string
 *                   description: The academic year filter applied
 *                   example: "2024-2025"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       group:
 *                         type: string
 *                       count:
 *                         type: number
 *       404:
 *         description: No groups found for this user
 *       500:
 *         description: Internal server error
 */
router.get("/paper-group-by-user/:user_id", statisticsController.getPaperGroupsByUser);

/**
 * @swagger
 * /statistics/top5-papers-points-by-author/{author_id}:
 *   get:
 *     summary: Get top 5 papers by contribution points for a specific author, optionally filtered by academic year
 *     tags: [Statistics]
 *     parameters:
 *       - in: path
 *         name: author_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the author
 *       - in: query
 *         name: academicYear
 *         schema:
 *           type: string
 *           example: "2024-2025"
 *         required: false
 *         description: The academic year to filter papers (e.g., "2024-2025")
 *     responses:
 *       200:
 *         description: Top 5 papers by contribution points for the author retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 academicYear:
 *                   type: string
 *                   description: The academic year filter applied
 *                   example: "2024-2025"
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
 *                       contributionScore:
 *                         type: number
 *                       authorDetails:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             user_id:
 *                               type: string
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
router.get("/top5-papers-points-by-author/:author_id", statisticsController.getTop5PapersByPointByUser);

/**
 * @swagger
 * /statistics/top5-paper-types-by-user/{user_id}:
 *   get:
 *     summary: Get top 5 paper types for a specific user, optionally filtered by academic year
 *     tags: [Statistics]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *       - in: query
 *         name: academicYear
 *         schema:
 *           type: string
 *           example: "2024-2025"
 *         required: false
 *         description: The academic year to filter papers (e.g., "2024-2025")
 *     responses:
 *       200:
 *         description: Top 5 paper types for the user retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 academicYear:
 *                   type: string
 *                   description: The academic year filter applied
 *                   example: "2024-2025"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                       count:
 *                         type: number
 *       404:
 *         description: No paper types found for this user
 *       500:
 *         description: Internal server error
 */
router.get("/top5-paper-types-by-user/:user_id", statisticsController.getTop5PaperTypesByUser);
module.exports = router;