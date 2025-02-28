const express = require("express");
const router = express.Router();
const paperViewsController = require("../controller/paperViewsController");

/**
 * @swagger
 * tags:
 *   name: PaperViews
 *   description: Paper views management endpoints
 */

/**
 * @swagger
 * /paperViews:
 *   post:
 *     summary: Create a new paper view
 *     tags: [PaperViews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               view_id:
 *                 type: string
 *               paper_id:
 *                 type: string
 *               user_id:
 *                 type: string
 *               view_time:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Paper view created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", paperViewsController.createPaperView);

/**
 * @swagger
 * /paperViews:
 *   get:
 *     summary: Get all paper views
 *     tags: [PaperViews]
 *     responses:
 *       200:
 *         description: List of paper views
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   view_id:
 *                     type: string
 *                   paper_id:
 *                     type: string
 *                   user_id:
 *                     type: string
 *                   view_time:
 *                     type: string
 *                     format: date
 */
router.get("/", paperViewsController.getAllPaperViews);

/**
 * @swagger
 * /paperViews/{id}:
 *   get:
 *     summary: Get a paper view by ID
 *     tags: [PaperViews]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The paper view ID
 *     responses:
 *       200:
 *         description: Paper view details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 view_id:
 *                   type: string
 *                 paper_id:
 *                   type: string
 *                 user_id:
 *                   type: string
 *                 view_time:
 *                   type: string
 *                   format: date
 *       404:
 *         description: Paper view not found
 */
router.get("/:id", paperViewsController.getPaperViewById);

/**
 * @swagger
 * /paperViews/{id}:
 *   put:
 *     summary: Update a paper view by ID
 *     tags: [PaperViews]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The paper view ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               view_id:
 *                 type: string
 *               paper_id:
 *                 type: string
 *               user_id:
 *                 type: string
 *               view_time:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Paper view updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Paper view not found
 */
router.put("/:id", paperViewsController.updatePaperViewById);

module.exports = router;
