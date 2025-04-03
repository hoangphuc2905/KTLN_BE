const express = require("express");
const router = express.Router();
const scientificPaperController = require("../controller/scientificPaperController");

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
 *     responses:
 *       200:
 *         description: List of scientific papers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   paper_id:
 *                     type: string
 *                   article_type:
 *                     type: string
 *                   article_group:
 *                     type: string
 *                   title_vn:
 *                     type: string
 *                   title_en:
 *                     type: string
 *                   author_count:
 *                     type: number
 *                   author:
 *                     type: array
 *                     items:
 *                       type: string
 *                       description: IDs of authors
 *                   publish_date:
 *                     type: string
 *                     format: date
 *                   magazine_vi:
 *                     type: string
 *                   magazine_en:
 *                     type: string
 *                   magazine_type:
 *                     type: string
 *                   page:
 *                     type: number
 *                   issn_isbn:
 *                     type: string
 *                   file:
 *                     type: string
 *                   link:
 *                     type: string
 *                   doi:
 *                     type: string
 *                   status:
 *                     type: boolean
 *                   order_no:
 *                     type: boolean
 *                   featured:
 *                     type: boolean
 *                   keywords:
 *                     type: string
 *                   summary:
 *                     type: string
 *                   department:
 *                     type: string
 *                   cover_image:
 *                     type: string
 */
router.get("/", scientificPaperController.getAllScientificPapers);

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
 *     summary: Get all scientific papers by user ID
 *     tags: [ScientificPapers]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID of the author
 *     responses:
 *       200:
 *         description: List of scientific papers for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   paper_id:
 *                     type: string
 *                   article_type:
 *                     type: string
 *                   article_group:
 *                     type: string
 *                   title_vn:
 *                     type: string
 *                   title_en:
 *                     type: string
 *                   author_count:
 *                     type: number
 *                   author:
 *                     type: array
 *                     items:
 *                       type: string
 *                       description: IDs of authors
 *                   publish_date:
 *                     type: string
 *                     format: date
 *                   magazine_vi:
 *                     type: string
 *                   magazine_en:
 *                     type: string
 *                   magazine_type:
 *                     type: string
 *                   page:
 *                     type: number
 *                   issn_isbn:
 *                     type: string
 *                   file:
 *                     type: string
 *                   link:
 *                     type: string
 *                   doi:
 *                     type: string
 *                   status:
 *                     type: boolean
 *                   order_no:
 *                     type: boolean
 *                   featured:
 *                     type: boolean
 *                   keywords:
 *                     type: string
 *                   summary:
 *                     type: string
 *                   department:
 *                     type: string
 *                   cover_image:
 *                     type: string
 *       404:
 *         description: No scientific papers found for this user
 *       500:
 *         description: Internal server error
 */
router.get(
  "/author/:userId",
  scientificPaperController.getScientificPapersByAuthorId
);

/**
 * @swagger
 * /scientificPapers/department/{department}:
 *   get:
 *     summary: Get all scientific papers by department
 *     tags: [ScientificPapers]
 *     parameters:
 *       - in: path
 *         name: department
 *         schema:
 *           type: string
 *         required: true
 *         description: The department name
 *     responses:
 *       200:
 *         description: List of scientific papers for the department
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   paper_id:
 *                     type: string
 *                   article_type:
 *                     type: string
 *                   article_group:
 *                     type: string
 *                   title_vn:
 *                     type: string
 *                   title_en:
 *                     type: string
 *                   author_count:
 *                     type: number
 *                   author:
 *                     type: array
 *                     items:
 *                       type: string
 *                       description: IDs of authors
 *                   publish_date:
 *                     type: string
 *                     format: date
 *                   magazine_vi:
 *                     type: string
 *                   magazine_en:
 *                     type: string
 *                   magazine_type:
 *                     type: string
 *                   page:
 *                     type: number
 *                   issn_isbn:
 *                     type: string
 *                   file:
 *                     type: string
 *                   link:
 *                     type: string
 *                   doi:
 *                     type: string
 *                   status:
 *                     type: boolean
 *                   order_no:
 *                     type: boolean
 *                   featured:
 *                     type: boolean
 *                   keywords:
 *                     type: string
 *                   summary:
 *                     type: string
 *                   department:
 *                     type: string
 *                   cover_image:
 *                     type: string
 *       404:
 *         description: No scientific papers found for this department
 *       500:
 *         description: Internal server error
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
 * /scientificpapers/total/{author_id}:
 *   get:
 *     summary: Get total number of scientific papers by an author
 *     tags: [ScientificPapers]
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
  "/total/:author_id",
  scientificPaperController.getTotalPapersByAuthorId
);

module.exports = router;
