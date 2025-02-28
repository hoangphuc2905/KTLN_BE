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
 * /paperTypes:
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
 *               type_id:
 *                 type: string
 *               type_name:
 *                 type: string
 *               type_score:
 *                 type: number
 *     responses:
 *       201:
 *         description: Paper type created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", paperTypeController.createPaperType);

/**
 * @swagger
 * /paperTypes:
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
 *                   type_id:
 *                     type: string
 *                   type_name:
 *                     type: string
 *                   type_score:
 *                     type: number
 */
router.get("/", paperTypeController.getAllPaperTypes);

/**
 * @swagger
 * /paperTypes/{type_id}:
 *   get:
 *     summary: Get a paper type by ID
 *     tags: [PaperTypes]
 *     parameters:
 *       - in: path
 *         name: type_id
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
 *                 type_id:
 *                   type: string
 *                 type_name:
 *                   type: string
 *                 type_score:
 *                   type: number
 *       404:
 *         description: Paper type not found
 */
router.get("/:type_id", paperTypeController.getPaperTypeById);

/**
 * @swagger
 * /paperTypes/{type_id}:
 *   put:
 *     summary: Update a paper type by ID
 *     tags: [PaperTypes]
 *     parameters:
 *       - in: path
 *         name: type_id
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
 *               type_score:
 *                 type: number
 *     responses:
 *       200:
 *         description: Paper type updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Paper type not found
 */
router.put("/:type_id", paperTypeController.updatePaperTypeById);


module.exports = router;
