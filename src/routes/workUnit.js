const express = require("express");
const router = express.Router();
const workUnitController = require("../controller/workUnitController");

/**
 * @swagger
 * tags:
 *   name: WorkUnits
 *   description: Work unit management endpoints
 */

/**
 * @swagger
 * /workUnits:
 *   post:
 *     summary: Create a new work unit
 *     tags: [WorkUnits]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               work_unit_id:
 *                 type: number
 *               name_vi:
 *                 type: string
 *               name_en:
 *                 type: string
 *               address_vi:
 *                 type: string
 *               address_en:
 *                 type: string
 *     responses:
 *       201:
 *         description: Work unit created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", workUnitController.createWorkUnit);

/**
 * @swagger
 * /workUnits:
 *   get:
 *     summary: Get all work units
 *     tags: [WorkUnits]
 *     responses:
 *       200:
 *         description: List of work units
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   work_unit_id:
 *                     type: number
 *                   name_vi:
 *                     type: string
 *                   name_en:
 *                     type: string
 *                   address_vi:
 *                     type: string
 *                   address_en:
 *                     type: string
 */
router.get("/", workUnitController.getAllWorkUnits);

/**
 * @swagger
 * /workUnits/{work_unit_id}:
 *   get:
 *     summary: Get a work unit by ID
 *     tags: [WorkUnits]
 *     parameters:
 *       - in: path
 *         name: work_unit_id
 *         schema:
 *           type: number
 *         required: true
 *         description: The work unit ID
 *     responses:
 *       200:
 *         description: Work unit details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 work_unit_id:
 *                   type: number
 *                 name_vi:
 *                   type: string
 *                 name_en:
 *                   type: string
 *                 address_vi:
 *                   type: string
 *                 address_en:
 *                   type: string
 *       404:
 *         description: Work unit not found
 */
router.get("/:work_unit_id", workUnitController.getWorkUnitById);

/**
 * @swagger
 * /workUnits/{work_unit_id}:
 *   put:
 *     summary: Update a work unit by ID
 *     tags: [WorkUnits]
 *     parameters:
 *       - in: path
 *         name: work_unit_id
 *         schema:
 *           type: number
 *         required: true
 *         description: The work unit ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name_vi:
 *                 type: string
 *               name_en:
 *                 type: string
 *               address_vi:
 *                 type: string
 *               address_en:
 *                 type: string
 *     responses:
 *       200:
 *         description: Work unit updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Work unit not found
 */
router.put("/:work_unit_id", workUnitController.updateWorkUnitById);

/**
 * @swagger
 * /workUnits/{work_unit_id}:
 *   delete:
 *     summary: Delete a work unit by ID
 *     tags: [WorkUnits]
 *     parameters:
 *       - in: path
 *         name: work_unit_id
 *         schema:
 *           type: number
 *         required: true
 *         description: The work unit ID
 *     responses:
 *       200:
 *         description: Work unit deleted successfully
 *       404:
 *         description: Work unit not found
 */
router.delete("/:work_unit_id", workUnitController.deleteWorkUnitById);

module.exports = router;
