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
