const express = require("express");
const router = express.Router();
const scientificPaperController = require("../controller/scientificPaperController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

/**
 * @swagger
 * tags:
 *   name: ScientificPapers
 *   description: Endpoints for managing scientific papers
 */

/**
 * @swagger
 * /scientificPapers:
 *   post:
 *     summary: Create a new scientific paper
 *     tags: [ScientificPapers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               article_type:
 *                 type: string
 *                 description: ID of the article type
 *               article_group:
 *                 type: string
 *                 description: ID of the article group
 *               title_vn:
 *                 type: string
 *                 description: Title in Vietnamese
 *               title_en:
 *                 type: string
 *                 description: Title in English
 *               author_count:
 *                 type: number
 *                 description: Number of authors
 *               author:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                       description: ID of the user (student or lecturer)
 *                     author_name_vi:
 *                       type: string
 *                       description: Author's name in Vietnamese
 *                     author_name_en:
 *                       type: string
 *                       description: Author's name in English
 *                     role:
 *                       type: string
 *                       description: Role of the author (e.g., Main Author, Co-Author)
 *                     work_unit_id:
 *                       type: string
 *                       description: ID of the work unit
 *                     degree:
 *                       type: string
 *                       enum: [Bachelor, Master, Doctor, Engineer, Professor, Associate_Professor]
 *                       description: Degree of the author
 *               publish_date:
 *                 type: string
 *                 format: date
 *                 description: Publish date of the paper
 *               magazine_vi:
 *                 type: string
 *                 description: Vietnamese magazine name
 *               magazine_en:
 *                 type: string
 *                 description: English magazine name
 *               magazine_type:
 *                 type: string
 *                 description: Type of the magazine
 *               page:
 *                 type: number
 *                 description: Number of pages
 *               issn_isbn:
 *                 type: string
 *                 description: ISSN or ISBN of the paper
 *               file:
 *                 type: string
 *                 description: File path or URL
 *               link:
 *                 type: string
 *                 description: Link to the paper
 *               doi:
 *                 type: string
 *                 description: DOI of the paper
 *               status:
 *                 type: boolean
 *                 description: Status of the paper
 *               order_no:
 *                 type: boolean
 *                 description: Order number
 *               featured:
 *                 type: boolean
 *                 description: Whether the paper is featured
 *               keywords:
 *                 type: string
 *                 description: Keywords for the paper
 *               summary:
 *                 type: string
 *                 description: Summary of the paper
 *               department:
 *                 type: string
 *                 description: Department associated with the paper
 *               cover_image:
 *                 type: string
 *                 description: Cover image URL or path
 *     responses:
 *       201:
 *         description: Scientific paper created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 scientificPaper:
 *                   type: object
 *                   description: The created scientific paper
 *       400:
 *         description: Bad request
 */
router.post("/", scientificPaperController.createScientificPaper);

/**
 * @swagger
 * /scientificPapers:
 *   get:
 *     summary: Get all scientific papers
 *     tags: [ScientificPapers]
 *     parameters:
 *       - in: query
 *         name: academicYear
 *         schema:
 *           type: string
 *           example: "2024-2025"
 *         required: false
 *         description: The academic year to filter scientific papers (e.g., "2024-2025")
 *     responses:
 *       200:
 *         description: List of scientific papers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 academicYear:
 *                   type: string
 *                   example: "2024-2025"
 *                 scientificPapers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       paper_id:
 *                         type: string
 *                       article_type:
 *                         type: string
 *                       article_group:
 *                         type: string
 *                       title_vn:
 *                         type: string
 *                       title_en:
 *                         type: string
 *                       author_count:
 *                         type: number
 *                       author:
 *                         type: array
 *                         items:
 *                           type: string
 *                           description: IDs of authors
 *                       publish_date:
 *                         type: string
 *                         format: date
 *                       magazine_vi:
 *                         type: string
 *                       magazine_en:
 *                         type: string
 *                       magazine_type:
 *                         type: string
 *                       page:
 *                         type: number
 *                       issn_isbn:
 *                         type: string
 *                       file:
 *                         type: string
 *                       link:
 *                         type: string
 *                       doi:
 *                         type: string
 *                       status:
 *                         type: boolean
 *                       order_no:
 *                         type: boolean
 *                       featured:
 *                         type: boolean
 *                       keywords:
 *                         type: string
 *                       summary:
 *                         type: string
 *                       department:
 *                         type: string
 *                       cover_image:
 *                         type: string
 *       500:
 *         description: Server error
 */
router.get("/", scientificPaperController.getAllScientificPapers);

/**
 * @swagger
 * /scientificPapers:
 *   get:
 *     summary: Get all scientific papers
 *     tags: [ScientificPapers]
 *     parameters:
 *       - in: query
 *         name: academicYear
 *         schema:
 *           type: string
 *           example: "2024-2025"
 *         required: false
 *         description: The academic year to filter scientific papers (e.g., "2024-2025")
 *     responses:
 *       200:
 *         description: List of scientific papers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 academicYear:
 *                   type: string
 *                   example: "2024-2025"
 *                 scientificPapers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       paper_id:
 *                         type: string
 *                       article_type:
 *                         type: string
 *                       article_group:
 *                         type: string
 *                       title_vn:
 *                         type: string
 *                       title_en:
 *                         type: string
 *                       author_count:
 *                         type: number
 *                       author:
 *                         type: array
 *                         items:
 *                           type: string
 *                           description: IDs of authors
 *                       publish_date:
 *                         type: string
 *                         format: date
 *                       magazine_vi:
 *                         type: string
 *                       magazine_en:
 *                         type: string
 *                       magazine_type:
 *                         type: string
 *                       page:
 *                         type: number
 *                       issn_isbn:
 *                         type: string
 *                       file:
 *                         type: string
 *                       link:
 *                         type: string
 *                       doi:
 *                         type: string
 *                       status:
 *                         type: boolean
 *                       order_no:
 *                         type: boolean
 *                       featured:
 *                         type: boolean
 *                       keywords:
 *                         type: string
 *                       summary:
 *                         type: string
 *                       department:
 *                         type: string
 *                       cover_image:
 *                         type: string
 *       500:
 *         description: Server error
 */
router.get(
  "/getAllScientificPapersByAllStatus",
  scientificPaperController.getAllScientificPapersByAllStatus
);

/**
 * @swagger
 * /scientificPapers/by-title:
 *   get:
 *     summary: Get scientific papers by title
 *     tags: [ScientificPapers]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         required: true
 *         description: The title of the scientific paper to search for
 *     responses:
 *       200:
 *         description: List of scientific papers with the matching title
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 scientificPapers:
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
 *                       author:
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
 *                       publish_date:
 *                         type: string
 *                         format: date
 *                       department:
 *                         type: string
 *                       keywords:
 *                         type: string
 *       400:
 *         description: Title is required
 *       404:
 *         description: No scientific papers found with the given title
 *       500:
 *         description: Server error
 */
router.get("/by-title", scientificPaperController.getScientificPapersByTitle);

/**
 * @swagger
 * /scientificPapers/top5-newest:
 *   get:
 *     summary: Get the top 5 newest scientific papers
 *     tags: [ScientificPapers]
 *     responses:
 *       200:
 *         description: Top 5 newest scientific papers retrieved successfully
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
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Internal server error
 */
router.get(
  "/top5-newest",
  scientificPaperController.getTop5NewestScientificPapers
);

/**
 * @swagger
 * /scientificPapers/top5-most-viewed-downloaded:
 *   get:
 *     summary: Get top 5 most viewed and downloaded scientific papers, optionally filtered by academic year
 *     tags: [ScientificPapers]
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
 *         description: Top 5 most viewed and downloaded scientific papers retrieved successfully
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
 *       500:
 *         description: Internal server error
 */
router.get(
  "/top5-most-viewed-downloaded",
  scientificPaperController.getTop5MostViewedAndDownloadedPapers
);

/**
 * @swagger
 * /scientificPapers/{id}:
 *   get:
 *     summary: Get a scientific paper by ID
 *     tags: [ScientificPapers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The scientific paper ID
 *     responses:
 *       200:
 *         description: Scientific paper details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paper_id:
 *                   type: string
 *                 article_type:
 *                   type: string
 *                 article_group:
 *                   type: string
 *                 title_vn:
 *                   type: string
 *                 title_en:
 *                   type: string
 *                 author_count:
 *                   type: number
 *                 author:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: IDs of authors
 *                 publish_date:
 *                   type: string
 *                   format: date
 *                 magazine_vi:
 *                   type: string
 *                 magazine_en:
 *                   type: string
 *                 magazine_type:
 *                   type: string
 *                 page:
 *                   type: number
 *                 issn_isbn:
 *                   type: string
 *                 file:
 *                   type: string
 *                 link:
 *                   type: string
 *                 doi:
 *                   type: string
 *                 status:
 *                   type: boolean
 *                 order_no:
 *                   type: boolean
 *                 featured:
 *                   type: boolean
 *                 keywords:
 *                   type: string
 *                 summary:
 *                   type: string
 *                 department:
 *                   type: string
 *                 cover_image:
 *                   type: string
 *       404:
 *         description: Scientific paper not found
 */
router.get("/:id", scientificPaperController.getScientificPaperById);

/**
 * @swagger
 * /scientificPapers/author/{userId}:
 *   get:
 *     summary: Get scientific papers by author ID
 *     tags: [ScientificPapers]
 *     parameters:
 *       - in: path
 *         name: userId
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
 *         description: The academic year to filter scientific papers (e.g., "2024-2025")
 *     responses:
 *       200:
 *         description: List of scientific papers by the author
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 academicYear:
 *                   type: string
 *                   example: "2024-2025"
 *                 scientificPapers:
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
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: No scientific papers found for the given author ID
 *       500:
 *         description: Server error
 */
router.get(
  "/author/:userId",
  scientificPaperController.getScientificPapersByAuthorId
);

/**
 * @swagger
 * /scientificPapers/department/{department}:
 *   get:
 *     summary: Get scientific papers by department
 *     tags: [ScientificPapers]
 *     parameters:
 *       - in: path
 *         name: department
 *         required: true
 *         schema:
 *           type: string
 *         description: Department ID
 *       - in: query
 *         name: academicYear
 *         schema:
 *           type: string
 *           example: "2024-2025"
 *         required: false
 *         description: The academic year to filter scientific papers (e.g., "2024-2025")
 *     responses:
 *       200:
 *         description: List of scientific papers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 academicYear:
 *                   type: string
 *                   example: "2024-2025"
 *                 scientificPapers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       paper_id:
 *                         type: string
 *                       title_en:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: No scientific papers found
 *       500:
 *         description: Server error
 */
router.get(
  "/department/:department",
  scientificPaperController.getScientificPapersByDepartment
);

/**
 * @swagger
 * /scientificPapers/status/{id}:
 *   put:
 *     summary: Update the status of a scientific paper
 *     tags: [ScientificPapers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the scientific paper
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, refused, revision]
 *                 description: The new status of the scientific paper
 *     responses:
 *       200:
 *         description: Scientific paper status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 scientificPaper:
 *                   type: object
 *                   description: The updated scientific paper
 *       400:
 *         description: Invalid status value
 *       404:
 *         description: Scientific paper not found
 *       500:
 *         description: Server error
 */
router.put(
  "/status/:id",
  scientificPaperController.updateScientificPaperStatus
);

/**
 * @swagger
 * /scientificPapers/{id}:
 *   put:
 *     summary: Update a scientific paper by ID
 *     tags: [ScientificPapers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The scientific paper ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               article_type:
 *                 type: string
 *               article_group:
 *                 type: string
 *               title_vn:
 *                 type: string
 *               title_en:
 *                 type: string
 *               author_count:
 *                 type: number
 *               author:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: IDs of authors
 *               publish_date:
 *                 type: string
 *                 format: date
 *               magazine_vi:
 *                 type: string
 *               magazine_en:
 *                 type: string
 *               magazine_type:
 *                 type: string
 *               page:
 *                 type: number
 *               issn_isbn:
 *                 type: string
 *               file:
 *                 type: string
 *               link:
 *                 type: string
 *               doi:
 *                 type: string
 *               status:
 *                 type: boolean
 *               order_no:
 *                 type: boolean
 *               featured:
 *                 type: boolean
 *               keywords:
 *                 type: string
 *               summary:
 *                 type: string
 *               department:
 *                 type: string
 *               cover_image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Scientific paper updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Scientific paper not found
 */
router.put("/:id", scientificPaperController.updateScientificPaperById);

/**
 * @swagger
 * /scientificPapers/compress:
 *   post:
 *     summary: Nén file PDF và trả về file đã nén
 *     tags: [ScientificPapers]
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
 *                 description: File PDF cần nén
 *     responses:
 *       200:
 *         description: File PDF đã nén trả về thành công
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Không có file upload hoặc file quá lớn sau khi nén
 *       500:
 *         description: Lỗi server
 */
router.post(
  "/compress",
  upload.single("file"),
  scientificPaperController.compressPDF
);

module.exports = router;
