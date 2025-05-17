const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({
  dest: "uploads/"
});
const studentController = require("../controller/studentControllers");
const authMiddleware = require("../middleware/authMiddleware");

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
 * /students/inactive/{departmentId}:
 *   get:
 *     summary: Get all inactive students by department
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: departmentId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the department
 *     responses:
 *       200:
 *         description: List of inactive students retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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
 *                       date_of_birth:
 *                         type: string
 *                         format: date
 *                       cccd:
 *                         type: string
 *                       address:
 *                         type: string
 *                       start_date:
 *                         type: string
 *                         format: date
 *                       department:
 *                         type: object
 *                         properties:
 *                           department_name:
 *                             type: string
 *                       isActive:
 *                         type: boolean
 *       404:
 *         description: No inactive students found for this department
 *       500:
 *         description: Internal server error
 */
router.get("/inactive/:departmentId", studentController.getInactiveStudentsByDepartment);

/**
 * @swagger
 * /students/import:
 *   post:
 *     summary: Import students from an Excel file
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The Excel file to upload
 *     responses:
 *       201:
 *         description: Students and accounts created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 students:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       student:
 *                         type: object
 *                         properties:
 *                           student_id:
 *                             type: string
 *                           full_name:
 *                             type: string
 *                           email:
 *                             type: string
 *                           phone:
 *                             type: string
 *                           gender:
 *                             type: string
 *                             enum: [male, female, other]
 *                           date_of_birth:
 *                             type: string
 *                             format: date
 *                           cccd:
 *                             type: string
 *                           address:
 *                             type: string
 *                           start_date:
 *                             type: string
 *                             format: date
 *                           department:
 *                             type: string
 *                           score_year:
 *                             type: number
 *                           avatar:
 *                             type: string
 *                           role:
 *                             type: string
 *                           degree:
 *                             type: string
 *                             enum: [Bachelor, Master, Doctor, Engineer, Professor, Associate_Professor]
 *                           isActive:
 *                             type: boolean
 *                       account:
 *                         type: object
 *                         properties:
 *                           user_id:
 *                             type: string
 *                           user_type:
 *                             type: string
 *       400:
 *         description: Bad request (e.g., no file uploaded or invalid file format)
 *       500:
 *         description: Internal server error
 */
router.post("/import", authMiddleware.authenticate, upload.single("file"), studentController.importStudentsFromExcel);

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

/**
 * @swagger
 * /students/status/{student_id}:
 *   put:
 *     summary: Update the active status of a student
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: student_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 description: The active status of the student
 *     responses:
 *       200:
 *         description: Student status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 student_id:
 *                   type: string
 *                 isActive:
 *                   type: boolean
 *       404:
 *         description: Student not found
 *       400:
 *         description: Bad request
 */
router.put("/status/:student_id", studentController.updateStatusStudentById);
module.exports = router;