const express = require("express");
const router = express.Router();
const studentController = require("../controller/studentControllers");

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Student management endpoints
 */

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student_id:
 *                 type: string
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *               cccd:
 *                 type: string
 *               address:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               department:
 *                 type: string
 *               score_year:
 *                 type: number
 *               avatar:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, student, lecturer]
 *               degree:
 *                 type: string
 *                 enum: [Bachelor, Master, Doctor, Engineer, Professor, Associate_Professor]
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Student created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", studentController.createStudent);

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: List of students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   student_id:
 *                     type: string
 *                   full_name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   gender:
 *                     type: string
 *                     enum: [male, female, other]
 *                   date_of_birth:
 *                     type: string
 *                     format: date
 *                   cccd:
 *                     type: string
 *                   address:
 *                     type: string
 *                   start_date:
 *                     type: string
 *                     format: date
 *                   department:
 *                     type: string
 *                   score_year:
 *                     type: number
 *                   avatar:
 *                     type: string
 *                   role:
 *                     type: string
 *                   degree:
 *                     type: string
 *                     enum: [Bachelor, Master, Doctor, Engineer, Professor, Associate_Professor]
 *                   isActive:
 *                     type: boolean
 */
router.get("/", studentController.getAllStudents);

/**
 * @swagger
 * /students/{student_id}:
 *   get:
 *     summary: Get a student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: student_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The student ID
 *     responses:
 *       200:
 *         description: Student details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 student_id:
 *                   type: string
 *                 full_name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 gender:
 *                   type: string
 *                   enum: [male, female, other]
 *                 date_of_birth:
 *                   type: string
 *                   format: date
 *                 cccd:
 *                   type: string
 *                 address:
 *                   type: string
 *                 start_date:
 *                   type: string
 *                   format: date
 *                 department:
 *                   type: string
 *                 score_year:
 *                   type: number
 *                 avatar:
 *                   type: string
 *                 role:
 *                   type: string
 *                 degree:
 *                   type: string
 *                   enum: [Bachelor, Master, Doctor, Engineer, Professor, Associate_Professor]
 *                 isActive:
 *                   type: boolean
 *       404:
 *         description: Student not found
 */
router.get("/:student_id", studentController.getStudentById);

/**
 * @swagger
 * /students/{student_id}:
 *   put:
 *     summary: Update a student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: student_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *               cccd:
 *                 type: string
 *               address:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               department:
 *                 type: string
 *               score_year:
 *                 type: number
 *               avatar:
 *                 type: string
 *               role:
 *                 type: string
 *               degree:
 *                 type: string
 *                 enum: [Bachelor, Master, Doctor, Engineer, Professor, Associate_Professor]
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Student not found
 */
router.put("/:student_id", studentController.updateStudentById);

module.exports = router;
