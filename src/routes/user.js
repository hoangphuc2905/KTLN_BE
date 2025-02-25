const express = require("express");
const router = express.Router();
const userController = require("../controller/userControllers");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
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
 *               role_id:
 *                 type: string
 *                 enum: [admin, student, lecturer]
 *               score_year:
 *                 type: number
 *               avatar:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", userController.createUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user_id:
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
 *                   role_id:
 *                     type: string
 *                     enum: [admin, student, lecturer]
 *                   score_year:
 *                     type: number
 *                   avatar:
 *                     type: string
 */
router.get("/", userController.getAllUsers);

/**
 * @swagger
 * /users/{user_id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User details
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
 *                 role_id:
 *                   type: string
 *                   enum: [admin, student, lecturer]
 *                 score_year:
 *                   type: number
 *                 avatar:
 *                   type: string
 *       404:
 *         description: User not found
 */
router.get("/:user_id", userController.getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
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
 *               role_id:
 *                 type: string
 *                 enum: [admin, student, lecturer]
 *               score_year:
 *                 type: number
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 */

router.put("/:id", userController.updateUserById);

module.exports = router;
