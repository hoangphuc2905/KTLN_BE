const express = require("express");
const router = express.Router();
const scientificPaperController = require("../controller/scientificPaperController");

/**
 * @swagger
 * tags:
 *   name: ScientificPapers
 *   description: Scientific papers management endpoints
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
 *               paper_id:
 *                 type: string
 *               article_type:
 *                 type: string
 *               article_group:
 *                 type: string
 *               title_vn:
 *                 type: string
 *               title_en:
 *                 type: string
 *               author_count:
 *                 type: string
 *               publish_date:
 *                 type: string
 *                 format: date
 *               magazine_vi:
 *                 type: string
 *               magazine_en:
 *                 type: string
 *                 format: date
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
 *               doi_number:
 *                 type: number
 *               status:
 *                 type: boolean
 *               order_no:
 *                 type: boolean
 *               featured:
 *                 type: boolean
 *               keywords:
 *                 type: string
 *               views:
 *                 type: string
 *               downloads:
 *                 type: string
 *               summary:
 *                 type: string
 *               department:
 *                 type: string
 *     responses:
 *       201:
 *         description: Scientific paper created successfully
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
 *                     type: string
 *                   publish_date:
 *                     type: string
 *                     format: date
 *                   magazine_vi:
 *                     type: string
 *                   magazine_en:
 *                     type: string
 *                     format: date
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
 *                   doi_number:
 *                     type: number
 *                   status:
 *                     type: boolean
 *                   order_no:
 *                     type: boolean
 *                   featured:
 *                     type: boolean
 *                   keywords:
 *                     type: string
 *                   views:
 *                     type: string
 *                   downloads:
 *                     type: string
 *                   summary:
 *                     type: string
 *                   department:
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
 *                   type: string
 *                 publish_date:
 *                   type: string
 *                   format: date
 *                 magazine_vi:
 *                   type: string
 *                 magazine_en:
 *                   type: string
 *                   format: date
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
 *                 doi_number:
 *                   type: number
 *                 status:
 *                   type: boolean
 *                 order_no:
 *                   type: boolean
 *                 featured:
 *                   type: boolean
 *                 keywords:
 *                   type: string
 *                 views:
 *                   type: string
 *                 downloads:
 *                   type: string
 *                 summary:
 *                   type: string
 *                 department:
 *                   type: string
 *       404:
 *         description: Scientific paper not found
 */
router.get("/:id", scientificPaperController.getScientificPaperById);

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
 *               paper_id:
 *                 type: string
 *               article_type:
 *                 type: string
 *               article_group:
 *                 type: string
 *               title_vn:
 *                 type: string
 *               title_en:
 *                 type: string
 *               author_count:
 *                 type: string
 *               publish_date:
 *                 type: string
 *                 format: date
 *               magazine_vi:
 *                 type: string
 *               magazine_en:
 *                 type: string
 *                 format: date
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
 *               doi_number:
 *                 type: number
 *               status:
 *                 type: boolean
 *               order_no:
 *                 type: boolean
 *               featured:
 *                 type: boolean
 *               keywords:
 *                 type: string
 *               views:
 *                 type: string
 *               downloads:
 *                 type: string
 *               summary:
 *                 type: string
 *               department:
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


module.exports = router;
