const express = require("express");
const router = express.Router();
const formulaController = require("../controller/formulaController");
const attributeController = require("../controller/attributeController");

/**
 * @swagger
 * tags:
 *   name: Formulas
 *   description: Formula management endpoints
 */

/**
 * @swagger
 * /formulas:
 *   post:
 *     summary: Create a new formula
 *     tags: [Formulas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               year:
 *                 type: number
 *               formula:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     attribute:
 *                       type: string
 *                     weight:
 *                       type: number
 *     responses:
 *       201:
 *         description: Formula created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", formulaController.createFormula);

/**
 * @swagger
 * /formulas/{year}:
 *   get:
 *     summary: Get a formula by year
 *     tags: [Formulas]
 *     parameters:
 *       - in: path
 *         name: year
 *         schema:
 *           type: number
 *         required: true
 *         description: The year of the formula
 *     responses:
 *       200:
 *         description: Formula details
 *       404:
 *         description: Formula not found
 */
router.get("/:year", formulaController.getFormulaByYear);

/**
 * @swagger
 * /formulas/{year}:
 *   put:
 *     summary: Update a formula by year
 *     tags: [Formulas]
 *     parameters:
 *       - in: path
 *         name: year
 *         schema:
 *           type: number
 *         required: true
 *         description: The year of the formula
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               formula:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     attribute:
 *                       type: string
 *                     weight:
 *                       type: number
 *     responses:
 *       200:
 *         description: Formula updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Formula not found
 */
router.put("/:year", formulaController.updateFormulaByYear);

/**
 * @swagger
 * /formulas/{year}:
 *   delete:
 *     summary: Delete a formula by year
 *     tags: [Formulas]
 *     parameters:
 *       - in: path
 *         name: year
 *         schema:
 *           type: number
 *         required: true
 *         description: The year of the formula
 *     responses:
 *       200:
 *         description: Formula deleted successfully
 *       404:
 *         description: Formula not found
 */
router.delete("/:year", formulaController.deleteFormulaByYear);
module.exports = router;
