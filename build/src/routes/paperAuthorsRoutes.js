const express = require("express");
const router = express.Router();
const paperAuthorController = require("../controller/paperAuthorController");

/**
 * @swagger
 * tags:
 *   name: PaperAuthors
 *   description: Paper Author management endpoints
 */

/**
 * @swagger
 * /paperauthor:
 *   post:
 *     summary: Create a new paper author
 *     tags: [PaperAuthors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paper_id:
 *                 type: string
 *               user_id:
 *                 type: string
 *               author_name_vi:
 *                 type: string
 *               author_name_en:
 *                 type: string
 *               role:
 *                 type: string
 *               point:
 *                 type: number
 *               work_unit_id:
 *                 type: string
 *               degree:
 *                 type: string
 *                 enum: [Bachelor, Master, Doctor, Egineer, Professor, Ossociate_Professor]
 *     responses:
 *       201:
 *         description: Paper author created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", paperAuthorController.createPaperAuthor);

/**
 * @swagger
 * /paperauthor:
 *   get:
 *     summary: Get all paper authors
 *     tags: [PaperAuthors]
 *     responses:
 *       200:
 *         description: List of paper authors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   paper_id:
 *                     type: string
 *                   user_id:
 *                     type: string
 *                   author_name_vi:
 *                     type: string
 *                   author_name_en:
 *                     type: string
 *                   role:
 *                     type: string
 *                   point:
 *                     type: number
 *                   work_unit_id:
 *                     type: string
 *                   degree:
 *                     type: string
 *                     enum: [Bachelor, Master, Doctor, Egineer, Professor, Ossociate_Professor]
 */
router.get("/", paperAuthorController.getAllPaperAuthors);

/**
 * @swagger
 * /paperauthor/statistics-by-department:
 *   get:
 *     summary: Get paper statistics grouped by department and filtered by academic year
 *     tags: [PaperAuthors]
 *     parameters:
 *       - in: query
 *         name: academicYear
 *         schema:
 *           type: string
 *           example: "2024-2025"
 *         required: false
 *         description: The academic year to filter paper statistics (e.g., "2024-2025")
 *     responses:
 *       200:
 *         description: Paper statistics grouped by department retrieved successfully
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
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       DEPARTMENT_ID:
 *                         type: string
 *                         description: Department ID
 *                       KHOA:
 *                         type: string
 *                         description: Department name
 *                       TỔNG_BÀI:
 *                         type: number
 *                         description: Total number of unique papers
 *                       TỔNG_ĐIỂM:
 *                         type: number
 *                         description: Total points of all papers in the department
 *       500:
 *         description: Internal server error
 */
router.get("/statistics-by-department", paperAuthorController.getAllPaperAuthorsByTolalPointsAndTotalPapers);

/**
 * @swagger
 * /paperauthor/department/{department_id}:
 *   get:
 *     summary: Get paper authors by department ID and optionally filter by academic year
 *     tags: [PaperAuthors]
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
 *           example: "2024-2025"
 *         required: false
 *         description: The academic year to filter paper authors (e.g., "2024-2025")
 *     responses:
 *       200:
 *         description: List of paper authors in the specified department
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
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       MÃ_TÁC_GIẢ:
 *                         type: string
 *                         description: Author ID
 *                       TÁC_GIẢ:
 *                         type: string
 *                         description: Author name
 *                       KHOA:
 *                         type: string
 *                         description: Department name
 *                       TỔNG_BÀI:
 *                         type: number
 *                         description: Total number of papers
 *                       TỔNG_ĐIỂM:
 *                         type: number
 *                         description: Total points of all papers
 *       404:
 *         description: No authors found for this department
 *       500:
 *         description: Internal server error
 */
router.get("/department/:department_id", paperAuthorController.getPaperAuthorsByDepartment);

/**
 * @swagger
 * /paperauthor/{id}:
 *   get:
 *     summary: Get a paper author by user ID
 *     tags: [PaperAuthors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID of the author
 *     responses:
 *       200:
 *         description: Paper author details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paper_id:
 *                   type: string
 *                 user_id:
 *                   type: string
 *                 author_name_vi:
 *                   type: string
 *                 author_name_en:
 *                   type: string
 *                 role:
 *                   type: string
 *                 point:
 *                   type: number
 *                 work_unit_id:
 *                   type: string
 *                 degree:
 *                   type: string
 *                   enum: [Bachelor, Master, Doctor, Engineer, Professor, Associate_Professor]
 *       404:
 *         description: Paper author not found
 */
router.get("/:id", paperAuthorController.getPaperAuthorById);

/**
 * @swagger
 * /paperauthor/{id}:
 *   put:
 *     summary: Update a paper author by ID
 *     tags: [PaperAuthors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The author ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paper_id:
 *                 type: string
 *               user_id:
 *                 type: string
 *               author_name_vi:
 *                 type: string
 *               author_name_en:
 *                 type: string
 *               role:
 *                 type: string
 *               point:
 *                 type: number
 *               work_unit_id:
 *                 type: string
 *               degree:
 *                 type: string
 *                 enum: [Bachelor, Master, Doctor, Egineer, Professor, Ossociate_Professor]
 *     responses:
 *       200:
 *         description: Paper author updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Paper author not found
 */
router.put("/:id", paperAuthorController.updatePaperAuthorById);

/**
 * @swagger
 * /paperauthor/paper/{paper_id}:
 *   get:
 *     summary: Get authors by paper ID
 *     tags: [PaperAuthors]
 *     parameters:
 *       - in: path
 *         name: paper_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The paper ID
 *     responses:
 *       200:
 *         description: List of authors for the specified paper
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user_id:
 *                     type: string
 *                   author_name_vi:
 *                     type: string
 *                   author_name_en:
 *                     type: string
 *                   role:
 *                     type: string
 *                   point:
 *                     type: number
 *                   work_unit_id:
 *                     type: string
 *                   degree:
 *                     type: string
 *                     enum: [Bachelor, Master, Doctor, Egineer, Professor, Ossociate_Professor]
 *       404:
 *         description: No authors found for this paper
 */
router.get("/paper/:paper_id", paperAuthorController.getAuthorsByPaperId);

/**
 * @swagger
 * /paperauthor/{id}:
 *   delete:
 *     summary: Delete a paper author by ID
 *     tags: [PaperAuthors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The author ID
 *     responses:
 *       200:
 *         description: Paper author deleted successfully
 *       404:
 *         description: Paper author not found
 */
router.delete("/:id", paperAuthorController.deletePaperAuthorById);
module.exports = router;