const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({
  dest: "uploads/"
});
const authMiddleware = require("../middleware/authMiddleware");
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
 * /lecturers/import:
 *   post:
 *     summary: Import lecturers from an Excel file
 *     tags: [Lecturers]
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
 *         description: Lecturers and accounts created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 lecturers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       lecturer:
 *                         type: object
 *                         properties:
 *                           lecturer_id:
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
 *                           department:
 *                             type: string
 *                           roles:
 *                             type: array
 *                             items:
 *                               type: string
 *                           avatar:
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
 *       403:
 *         description: Unauthorized (e.g., no department found for the user)
 *       500:
 *         description: Internal server error
 */
router.post("/import", authMiddleware.authenticate, upload.single("file"), lecturerController.importLecturersFromExcel);

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
 *                       isActive:
 *                         type: boolean
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
router.get("/lecturers-and-students/:department_id", lecturerController.getLecturerAndStudentByDepartment);

/**
 * @swagger
 * /lecturers/status/{lecturer_id}:
 *   put:
 *     summary: Update the active status of a lecturer
 *     tags: [Lecturers]
 *     parameters:
 *       - in: path
 *         name: lecturer_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the lecturer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 description: The active status of the lecturer
 *     responses:
 *       200:
 *         description: Lecturer status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 lecturer_id:
 *                   type: string
 *                 isActive:
 *                   type: boolean
 *       404:
 *         description: Lecturer not found
 *       400:
 *         description: Bad request
 */
router.put("/status/:lecturer_id", lecturerController.updateStatusLecturerById);

/**
 * @swagger
 * /lecturers/assign-role:
 *   post:
 *     summary: Assign or change a role for a lecturer
 *     tags: [Lecturers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               adminId:
 *                 type: string
 *                 description: ID of the admin performing the action
 *               lecturerId:
 *                 type: string
 *                 description: ID of the lecturer to assign the role to
 *               newRole:
 *                 type: string
 *                 description: The new role to assign
 *             example:
 *               adminId: "21000000"
 *               lecturerId: "21000001"
 *               newRole: "head_of_department"
 *     responses:
 *       200:
 *         description: Role assigned successfully
 *       400:
 *         description: Invalid input or role assignment rules violated
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Lecturer not found
 *       500:
 *         description: Server error
 */
router.post("/assign-role", lecturerController.assignRole);

/**
 * @swagger
 * /lecturers/delete-role:
 *   post:
 *     summary: Delete a role from a lecturer
 *     tags: [Lecturers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               adminId:
 *                 type: string
 *                 description: ID of the admin performing the action
 *               lecturerId:
 *                 type: string
 *                 description: ID of the lecturer
 *               role:
 *                 type: string
 *                 description: ID of the role to remove
 *             example:
 *               adminId: "21000000"
 *               lecturerId: "21111111"
 *               role: "67e0034aad59fbe6e1602a4e"
 *     responses:
 *       200:
 *         description: Role removed successfully
 *       400:
 *         description: Missing required fields or role not assigned
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Lecturer not found
 *       500:
 *         description: Server error
 */
router.post("/delete-role", lecturerController.deleteRole);

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