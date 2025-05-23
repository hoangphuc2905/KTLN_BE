const express = require("express");
const router = express.Router();
const authController = require("../controller/authControllers");
const authMiddleware = require("../middleware/authMiddleware"); // Import middleware để xác thực token

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Invalid user_id or password
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Refresh token required
 *       403:
 *         description: Invalid or expired refresh token
 */
router.post("/refresh-token", authController.refreshToken);

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Change a user's password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid user_id or password
 */
router.post("/change-password", authController.changePassword);

/**
 * @swagger
 * /auth/userinfo:
 *   get:
 *     summary: Get user information
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: [] # Yêu cầu Bearer Token
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: string
 *                 full_name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
router.get("/userinfo", authMiddleware.authenticate, authController.getUserInfo);

/**
 * @swagger
 * /auth/update-info:
 *   put:
 *     summary: Update user information
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
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
 *               address:
 *                 type: string
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: User information updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid user_type or bad request
 *       401:
 *         description: Unauthorized
 */
router.put("/update-info", authMiddleware.authenticate, authController.updateUserInfo);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new student
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student_id:
 *                 type: string
 *                 description: Unique ID for the student
 *               full_name:
 *                 type: string
 *                 description: Full name of the student
 *               email:
 *                 type: string
 *                 description: Email address of the student
 *               phone:
 *                 type: string
 *                 description: Phone number of the student
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 description: Gender of the student
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *                 description: Date of birth of the student
 *               cccd:
 *                 type: string
 *                 description: Citizen ID of the student
 *               address:
 *                 type: string
 *                 description: Address of the student
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: Start date of the student
 *               department:
 *                 type: string
 *                 description: Department ID the student belongs to
 *     responses:
 *       201:
 *         description: Student registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Student registered successfully. Awaiting approval.
 *                 student:
 *                   type: object
 *                   properties:
 *                     student_id:
 *                       type: string
 *                     full_name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     gender:
 *                       type: string
 *                     date_of_birth:
 *                       type: string
 *                       format: date
 *                     cccd:
 *                       type: string
 *                     address:
 *                       type: string
 *                     start_date:
 *                       type: string
 *                       format: date
 *                     department:
 *                       type: string
 *                     isActive:
 *                       type: boolean
 *                     score_year:
 *                       type: number
 *                     degree:
 *                       type: string
 *                     role:
 *                       type: string
 *                     avatar:
 *                       type: string
 *                 account:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                     user_type:
 *                       type: string
 *       400:
 *         description: Bad request (e.g., student ID or email already exists)
 *       500:
 *         description: Internal server error
 */
router.post("/register", authController.registerStudent);

/**
 * @swagger
 * /auth/approve/{studentId}:
 *   patch:
 *     summary: Approve a student and send login credentials via email
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the student to approve
 *     responses:
 *       200:
 *         description: Student approved and email sent successfully
 *       400:
 *         description: Student is already approved
 *       404:
 *         description: Student not found
 *       500:
 *         description: Internal server error
 */
router.patch("/approve/:studentId", authController.approveStudent);
module.exports = router;