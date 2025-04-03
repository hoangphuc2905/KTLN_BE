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
 * /paperview:
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
 *               user_type:
 *                 type: string
 *                 enum: ["Lecturer", "Student"]
 *                 description: Type of user viewing the paper
 *               user_id:
 *                 type: string
 *                 description: ID of the user (Lecturer or Student) based on user_type
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
 * /paperview:
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
 *                   user_type:
 *                     type: string
 *                     enum: ["Lecturer", "Student"]
 *                     description: Type of user viewing the paper
 *                   user_id:
 *                     type: string
 *                     description: ID of the user (Lecturer or Student) based on user_type
 *                   view_time:
 *                     type: string
 *                     format: date
 */
router.get("/", paperViewsController.getAllPaperViews);

/**
 * @swagger
 * /paperview/{id}:
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
 *                 user_type:
 *                   type: string
 *                   enum: ["Lecturer", "Student"]
 *                   description: Type of user viewing the paper
 *                 user_id:
 *                   type: string
 *                   description: ID of the user (Lecturer or Student) based on user_type
 *                 view_time:
 *                   type: string
 *                   format: date
 *       404:
 *         description: Paper view not found
 */
router.get("/:id", paperViewsController.getPaperViewById);

/**
 * @swagger
 * /paperview/{id}:
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
 *               user_type:
 *                 type: string
 *                 enum: ["Lecturer", "Student"]
 *                 description: Type of user viewing the paper
 *               user_id:
 *                 type: string
 *                 description: ID of the user (Lecturer or Student) based on user_type
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

/**
 * @swagger
 * /paperview/count/{paper_id}:
 *   get:
 *     summary: Get the view count for a specific paper
 *     tags: [PaperViews]
 *     parameters:
 *       - in: path
 *         name: paper_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the paper to get the view count for
 *     responses:
 *       200:
 *         description: View count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 viewCount:
 *                   type: number
 *       404:
 *         description: Paper not found
 *       500:
 *         description: Internal server error
 */
router.get("/count/:paper_id", paperViewsController.getViewCountByPaperId);


module.exports = router;
