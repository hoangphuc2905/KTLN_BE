const express = require("express");
const router = express.Router();
const academicYearController = require("../controller/academicYearController");

/**
 * @swagger
 * tags:
 *   name: AcademicYears
 *   description: API for managing academic years
 */

/**
 * @swagger
 * /academic-years:
 *   get:
 *     summary: Get a list of academic years
 *     tags: [AcademicYears]
 *     responses:
 *       200:
 *         description: List of academic years retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 academicYears:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "2023-2024"
 *       500:
 *         description: Server error
 */
router.get("/", academicYearController.getAcademicYears);

/**
 * @swagger
 * /academic-years/default:
 *   get:
 *     summary: Get the default academic year
 *     tags: [AcademicYears]
 *     responses:
 *       200:
 *         description: Default academic year retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 academicYear:
 *                   type: string
 *                   example: "2023-2024"
 *       500:
 *         description: Server error
 */
router.get("/default", academicYearController.getDefaultAcademicYear);

module.exports = router;
