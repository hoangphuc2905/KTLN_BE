const express = require("express");
const router = express.Router();
const attributeController = require("../controller/attributeController");

/**
 * @swagger
 * tags:
 *   name: Attributes
 *   description: Attribute management endpoints
 */

/**
 * @swagger
 * /attributes:
 *   post:
 *     summary: Create a new attribute
 *     tags: [Attributes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               year:
 *                 type: number
 *               name:
 *                 type: string
 *               values:
 *                 type: object
 *                 additionalProperties:
 *                   type: number
 *           examples:
 *             example:
 *               value:
 *                 year: 2024
 *                 name: "theonhom"
 *                 values:
 *                   Q1: 1
 *                   Q2: 2
 *                   Q3: 3
 *     responses:
 *       201:
 *         description: Attribute created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", attributeController.createAttribute);

/**
 * @swagger
 * /attributes/{year}:
 *   get:
 *     summary: Get attributes by year
 *     tags: [Attributes]
 *     parameters:
 *       - in: path
 *         name: year
 *         schema:
 *           type: number
 *         required: true
 *         description: The year of the attributes
 *     responses:
 *       200:
 *         description: Attribute details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 year:
 *                   type: number
 *                 name:
 *                   type: string
 *                 values:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *             examples:
 *               example:
 *                 value:
 *                   year: 2024
 *                   name: "theonhom"
 *                   values:
 *                     Q1: 1
 *                     Q2: 2
 *                     Q3: 3
 */
router.get("/:year", attributeController.getAttributeByYear);

/**
 * @swagger
 * /attributes/{year}:
 *   put:
 *     summary: Update attributes by year
 *     tags: [Attributes]
 *     parameters:
 *       - in: path
 *         name: year
 *         schema:
 *           type: number
 *         required: true
 *         description: The year of the attributes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               values:
 *                 type: object
 *                 additionalProperties:
 *                   type: number
 *     responses:
 *       200:
 *         description: Attribute updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Attribute not found
 *     examples:
 *       application/json:
 *         value:
 *           year: 2025
 *           name: "journal_group"
 *           values:
 *             Q1: 600
 *             Q2: 400
 */
router.put("/:year", attributeController.updateAttributeByYear);

/**
 * @swagger
 * /attributes/{year}:
 *   delete:
 *     summary: Delete attributes by year
 *     tags: [Attributes]
 *     parameters:
 *       - in: path
 *         name: year
 *         schema:
 *           type: number
 *         required: true
 *         description: The year of the attributes
 *     responses:
 *       200:
 *         description: Attribute deleted successfully
 *       404:
 *         description: Attribute not found
 */
router.delete("/:year", attributeController.deleteAttributeByYear);

module.exports = router;
