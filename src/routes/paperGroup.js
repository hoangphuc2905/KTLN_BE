const express = require("express");
const router = express.Router();
const paperGroupController = require("../controller/paperGroupController");

/**
 * @swagger
 * tags:
 *   name: PaperGroups
 *   description: Paper group management endpoints
 */

/**
 * @swagger
 * /paperGroups:
 *   post:
 *     summary: Create a new paper group
 *     tags: [PaperGroups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               group_id:
 *                 type: string
 *               group_name:
 *                 type: string
 *               group_score:
 *                 type: number
 *     responses:
 *       201:
 *         description: Paper group created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", paperGroupController.createPaperGroup);

/**
 * @swagger
 * /paperGroups:
 *   get:
 *     summary: Get all paper groups
 *     tags: [PaperGroups]
 *     responses:
 *       200:
 *         description: List of paper groups
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   group_id:
 *                     type: string
 *                   group_name:
 *                     type: string
 *                   group_score:
 *                     type: number
 */
router.get("/", paperGroupController.getAllPaperGroups);

/**
 * @swagger
 * /paperGroups/{group_id}:
 *   get:
 *     summary: Get a paper group by ID
 *     tags: [PaperGroups]
 *     parameters:
 *       - in: path
 *         name: group_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The paper group ID
 *     responses:
 *       200:
 *         description: Paper group details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 group_id:
 *                   type: string
 *                 group_name:
 *                   type: string
 *                 group_score:
 *                   type: number
 *       404:
 *         description: Paper group not found
 */
router.get("/:group_id", paperGroupController.getPaperGroupById);

/**
 * @swagger
 * /paperGroups/{group_id}:
 *   put:
 *     summary: Update a paper group by ID
 *     tags: [PaperGroups]
 *     parameters:
 *       - in: path
 *         name: group_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The paper group ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               group_name:
 *                 type: string
 *               group_score:
 *                 type: number
 *     responses:
 *       200:
 *         description: Paper group updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Paper group not found
 */
router.put("/:group_id", paperGroupController.updatePaperGroupById);


module.exports = router;
