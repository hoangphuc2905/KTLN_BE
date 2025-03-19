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
 *               author_id:
 *                 type: string
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *               cccd:
 *                 type: string
 *               address:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               department:
 *                 type: string
 *               score_year:
 *                 type: number
 *               avatar:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, student, lecturer]
 *               degree:
 *                 type: string
 *                 enum: [Bachelor, Master, Doctor, Engineer, Professor, Associate_Professor]
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
 *                   author_id:
 *                     type: string
 *                   full_name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   gender:
 *                     type: string
 *                     enum: [male, female, other]
 *                   date_of_birth:
 *                     type: string
 *                     format: date
 *                   cccd:
 *                     type: string
 *                   address:
 *                     type: string
 *                   start_date:
 *                     type: string
 *                     format: date
 *                   department:
 *                     type: string
 *                   score_year:
 *                     type: number
 *                   avatar:
 *                     type: string
 *                   role:
 *                     type: string
 *                   degree:
 *                     type: string
 *                     enum: [Bachelor, Master, Doctor, Engineer, Professor, Associate_Professor]
 */
router.get("/", paperAuthorController.getAllPaperAuthors);

/**
 * @swagger
 * /paperAuthors/{author_id}:
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
 *                 author_id:
 *                   type: string
 *                 full_name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 gender:
 *                   type: string
 *                   enum: [male, female, other]
 *                 date_of_birth:
 *                   type: string
 *                   format: date
 *                 cccd:
 *                   type: string
 *                 address:
 *                   type: string
 *                 start_date:
 *                   type: string
 *                   format: date
 *                 department:
 *                   type: string
 *                 score_year:
 *                   type: number
 *                 avatar:
 *                   type: string
 *                 role:
 *                   type: string
 *                 degree:
 *                   type: string
 *                   enum: [Bachelor, Master, Doctor, Engineer, Professor, Associate_Professor]
 *       404:
 *         description: Paper author not found
 */
router.get("/:author_id", paperAuthorController.getPaperAuthorById);

/**
 * @swagger
 * /paperAuthors/{author_id}:
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
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *               cccd:
 *                 type: string
 *               address:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               department:
 *                 type: string
 *               score_year:
 *                 type: number
 *               avatar:
 *                 type: string
 *               role:
 *                 type: string
 *               degree:
 *                 type: string
 *                 enum: [Bachelor, Master, Doctor, Engineer, Professor, Associate_Professor]
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
 * /paperAuthors/{author_id}:
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
