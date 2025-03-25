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
 *                   work_unit_id:
 *                     type: string
 *                   degree:
 *                     type: string
 *                     enum: [Bachelor, Master, Doctor, Egineer, Professor, Ossociate_Professor]
 */
router.get("/", paperAuthorController.getAllPaperAuthors);

/**
 * @swagger
 * /paperauthor/{author_id}:
 *   get:
 *     summary: Get a paper author by ID
 *     tags: [PaperAuthors]
 *     parameters:
 *       - in: path
 *         name: author_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The author ID
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
 *                 work_unit_id:
 *                   type: string
 *                 degree:
 *                   type: string
 *                   enum: [Bachelor, Master, Doctor, Egineer, Professor, Ossociate_Professor]
 *       404:
 *         description: Paper author not found
 */
router.get("/:author_id", paperAuthorController.getPaperAuthorById);

/**
 * @swagger
 * /paperauthor/{author_id}:
 *   put:
 *     summary: Update a paper author by ID
 *     tags: [PaperAuthors]
 *     parameters:
 *       - in: path
 *         name: author_id
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
router.put("/:author_id", paperAuthorController.updatePaperAuthorById);

/**
 * @swagger
 * /paperauthor/{author_id}:
 *   delete:
 *     summary: Delete a paper author by ID
 *     tags: [PaperAuthors]
 *     parameters:
 *       - in: path
 *         name: author_id
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
router.delete("/:author_id", paperAuthorController.deletePaperAuthorById);

module.exports = router;
