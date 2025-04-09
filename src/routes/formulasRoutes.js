const express = require("express");
const router = express.Router();
const formulaController = require("../controller/formulaController");

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
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
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
 * /formulas/update:
 *   put:
 *     summary: Update a formula by ID
 *     tags: [Formulas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the formula to update
 *               updateData:
 *                 type: object
 *                 description: The fields to update in the formula
 *     responses:
 *       200:
 *         description: Formula updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Formula not found
 */
router.put("/update", formulaController.updateFormula);

/**
 * @swagger
 * /formulas/get-by-date-range:
 *   post:
 *     summary: Get formulas by date range
 *     tags: [Formulas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Formula details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   startDate:
 *                     type: string
 *                     format: date
 *                   endDate:
 *                     type: string
 *                     format: date
 *                   formula:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         attribute:
 *                           type: string
 *                         weight:
 *                           type: number
 *       404:
 *         description: Formula not found
 */
router.post("/get-by-date-range", formulaController.getFormulaByDateRange);

/**
 * @swagger
 * /formulas/update-by-date-range:
 *   put:
 *     summary: Update a formula by date range
 *     tags: [Formulas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
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
router.put("/update-by-date-range", formulaController.updateFormulaByDateRange);

/**
 * @swagger
 * /formulas/delete-by-date-range:
 *   delete:
 *     summary: Delete a formula by date range
 *     tags: [Formulas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Formula deleted successfully
 *       404:
 *         description: Formula not found
 */
router.delete(
  "/delete-by-date-range",
  formulaController.deleteFormulaByDateRange
);

/**
 * @swagger
 * /formulas:
 *   get:
 *     summary: Get all date ranges with formulas
 *     tags: [Formulas]
 *     responses:
 *       200:
 *         description: List of date ranges
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   startDate:
 *                     type: string
 *                     format: date
 *                   endDate:
 *                     type: string
 *                     format: date
 */
router.get("/", formulaController.getAllFormula);

/**
 * @swagger
 * /formulas/add-date-range:
 *   post:
 *     summary: Add a new date range
 *     tags: [Formulas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Date range added successfully
 *       400:
 *         description: Date range already exists
 */
router.post("/add-date-range", formulaController.addNewDateRange);

module.exports = router;
