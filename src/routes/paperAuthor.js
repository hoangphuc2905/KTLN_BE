const express = require("express");
const router = express.Router();
const paperAuthorController = require("../controller/paperAuthorController");

/**
 * @swagger
 * tags:
 *   name: PaperAuthors
 *   description: Paper authors management endpoints
 */

/**
 * @swagger
 * /paperAuthors:
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
 *     responses:
 *       201:
 *         description: Paper author created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", paperAuthorController.createPaperAuthor);

/**
 * @swagger
 * /paperAuthors:
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
 */
router.get("/", paperAuthorController.getAllPaperAuthors);

/**
 * @swagger
 * /paperAuthors/{id}:
 *   get:
 *     summary: Get a paper author by ID
 *     tags: [PaperAuthors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The paper author ID
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
 *       404:
 *         description: Paper author not found
 */
router.get("/:id", paperAuthorController.getPaperAuthorById);

/**
 * @swagger
 * /paperAuthors/{id}:
 *   put:
 *     summary: Update a paper author by ID
 *     tags: [PaperAuthors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The paper author ID
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
 * /paperAuthors/{id}:
 *   delete:
 *     summary: Delete a paper author by ID
 *     tags: [PaperAuthors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The paper author ID
 *     responses:
 *       200:
 *         description: Paper author deleted successfully
 *       404:
 *         description: Paper author not found
 */
router.delete("/:id", paperAuthorController.deletePaperAuthorById);

module.exports = router;