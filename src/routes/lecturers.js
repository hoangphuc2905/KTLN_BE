const express = require("express");
const router = express.Router();
const lecturerController = require("../controller/lecturerController");

/**
 * @swagger
 * tags:
 *   name: Lecturers
 *   description: Lecturer management endpoints
 */

/**
 * @swagger
 * /lecturers:
 *   post:
 *     summary: Create a new lecturer
 *     tags: [Lecturers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lecturer_id:
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
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *               score_year:
 *                 type: number
 *               avatar:
 *                 type: string
 *               degree:
 *                 type: string
 *                 enum: [Bachelor, Master, Doctor, Engineer, Professor, Associate_Professor]
 *               isActive:
 *                type: boolean
 *     responses:
 *       201:
 *         description: Lecturer created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", lecturerController.createLecturer);

/**
 * @swagger
 * /lecturers:
 *   get:
 *     summary: Get all lecturers
 *     tags: [Lecturers]
 *     responses:
 *       200:
 *         description: List of lecturers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   lecturer_id:
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
 *                   roles:
 *                     type: array
 *                     items:
 *                       type: string
 *                   score_year:
 *                     type: number
 *                   avatar:
 *                     type: string
 *                   degree:
 *                     type: string
 *                     enum: [Bachelor, Master, Doctor, Engineer, Professor, Associate_Professor]
 *                   isActive:
 *                     type: boolean
 */
router.get("/", lecturerController.getAllLecturers);

/**
 * @swagger
 * /lecturers/{lecturer_id}:
 *   get:
 *     summary: Get a lecturer by ID
 *     tags: [Lecturers]
 *     parameters:
 *       - in: path
 *         name: lecturer_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The lecturer ID
 *     responses:
 *       200:
 *         description: Lecturer details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 lecturer_id:
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
 *                 roles:
 *                   type: array
 *                   items:
 *                     type: string
 *                 score_year:
 *                   type: number
 *                 avatar:
 *                   type: string
 *                 degree:
 *                   type: string
 *                   enum: [Bachelor, Master, Doctor, Engineer, Professor, Associate_Professor]
 *                 isActive:
 *                   type: boolean
 *       404:
 *         description: Lecturer not found
 */
router.get("/:lecturer_id", lecturerController.getLecturerById);

/**
 * @swagger
 * /lecturers/{lecturer_id}:
 *   put:
 *     summary: Update a lecturer by ID
 *     tags: [Lecturers]
 *     parameters:
 *       - in: path
 *         name: lecturer_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The lecturer ID
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
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *               score_year:
 *                 type: number
 *               avatar:
 *                 type: string
 *               degree:
 *                 type: string
 *                 enum: [Bachelor, Master, Doctor, Engineer, Professor, Associate_Professor]
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Lecturer updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Lecturer not found
 */
router.put("/:lecturer_id", lecturerController.updateLecturerById);

/**
 * @swagger
 * /lecturers/lecturers-and-students/{department_id}:
 *   get:
 *     summary: Get all lecturers and students of a specific department
 *     tags: [Lecturers, Students]
 *     parameters:
 *       - in: path
 *         name: department_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The department ID
 *     responses:
 *       200:
 *         description: List of lecturers and students
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 lecturers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       lecturer_id:
 *                         type: string
 *                       full_name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       gender:
 *                         type: string
 *                         enum: [male, female, other]
 *                       date_of_birth:
 *                         type: string
 *                         format: date
 *                       department:
 *                         type: string
 *                 students:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       student_id:
 *                         type: string
 *                       full_name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       gender:
 *                         type: string
 *                         enum: [male, female, other]
 *                       date_of_birth:
 *                         type: string
 *                         format: date
 *                       department:
 *                         type: string
 *                       isActive:
 *                         type: boolean
 *     404:
 *       description: Department not found
 */
router.get(
  "/lecturers-and-students/:department_id",
  lecturerController.getLecturerAndStudentByDepartment
);

/**
 * @swagger
 * /lecturers/{lecturer_id}:
 *   delete:
 *     summary: Delete a lecturer by ID
 *     tags: [Lecturers]
 *     parameters:
 *       - in: path
 *         name: lecturer_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The lecturer ID
 *     responses:
 *       200:
 *         description: Lecturer deleted successfully
 *       404:
 *         description: Lecturer not found
 */
router.delete("/:lecturer_id", lecturerController.deleteLecturerById);

module.exports = router;
