const express = require("express");
const router = express.Router();
const paperTypeController = require("../controller/paperTypeController");

/**
 * @swagger
 * tags:
 *   name: PaperTypes
 *   description: Paper type management endpoints
 */

/**
 * @swagger
 * /papertypes:
 *   post:
 *     summary: Create a new paper type
 *     tags: [PaperTypes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Paper type created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", paperTypeController.createPaperType);

/**
 * @swagger
 * /papertypes:
 *   get:
 *     summary: Get all paper types
 *     tags: [PaperTypes]
 *     responses:
 *       200:
 *         description: List of paper types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   type_name:
 *                     type: string
 */
router.get("/", paperTypeController.getAllPaperTypes);

/**
 * @swagger
 * /papertypes/{_id}:
 *   get:
 *     summary: Get a paper type by ID
 *     tags: [PaperTypes]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: The paper type ID
 *     responses:
 *       200:
 *         description: Paper type details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 type_name:
 *                   type: string
 *       404:
 *         description: Paper type not found
 */
router.get("/:_id", paperTypeController.getPaperTypeById);

/**
 * @swagger
 * /papertypes/{_id}:
 *   put:
 *     summary: Update a paper type by ID
 *     tags: [PaperTypes]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: The paper type ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Paper type updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Paper type not found
 */
router.put("/:_id", paperTypeController.updatePaperTypeById);

/**
 * @swagger
 * /papertypes/{_id}:
 *   delete:
 *     summary: Delete a paper type by ID
 *     tags: [PaperTypes]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: The paper type ID
 *     responses:
 *       200:
 *         description: Paper type deleted successfully
 *       404:
 *         description: Paper type not found
 */
router.delete("/:_id", paperTypeController.deletePaperTypeById);
module.exports = router;