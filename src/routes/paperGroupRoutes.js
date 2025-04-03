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
 * /papergroups:
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
 *               group_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Paper group created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", paperGroupController.createPaperGroup);

/**
 * @swagger
 * /papergroups:
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
 *                   _id:
 *                     type: string
 *                   group_name:
 *                     type: string
 */
router.get("/", paperGroupController.getAllPaperGroups);

/**
 * @swagger
 * /papergroups/{_id}:
 *   get:
 *     summary: Get a paper group by ID
 *     tags: [PaperGroups]
 *     parameters:
 *       - in: path
 *         name: _id
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
 *                 _id:
 *                   type: string
 *                 group_name:
 *                   type: string
 *       404:
 *         description: Paper group not found
 */
router.get("/:_id", paperGroupController.getPaperGroupById);

/**
 * @swagger
 * /papergroups/{_id}:
 *   put:
 *     summary: Update a paper group by ID
 *     tags: [PaperGroups]
 *     parameters:
 *       - in: path
 *         name: _id
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
 *     responses:
 *       200:
 *         description: Paper group updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Paper group not found
 */
router.put("/:_id", paperGroupController.updatePaperGroupById);

/**
 * @swagger
 * /papergroups/{_id}:
 *   delete:
 *     summary: Delete a paper group by ID
 *     tags: [PaperGroups]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: The paper group ID
 *     responses:
 *       200:
 *         description: Paper group deleted successfully
 *       404:
 *         description: Paper group not found
 */
router.delete("/:_id", paperGroupController.deletePaperGroupById);

module.exports = router;
