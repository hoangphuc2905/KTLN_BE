const express = require("express");
const router = express.Router();
const userWorkController = require("../controller/userWorkController");

/**
 * @swagger
 * tags:
 *   name: UserWorks
 *   description: User work management endpoints
 */

/**
 * @swagger
 * /userworks:
 *   post:
 *     summary: Create a new user work
 *     tags: [UserWorks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               work_unit_id:
 *                 type: string
 *               user_id:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               role_vi:
 *                 type: string
 *               role_en:
 *                 type: string
 *               department:
 *                 type: string
 *     responses:
 *       201:
 *         description: User work created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", userWorkController.createUserWork);

/**
 * @swagger
 * /userworks:
 *   get:
 *     summary: Get all user works
 *     tags: [UserWorks]
 *     responses:
 *       200:
 *         description: List of user works
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   work_unit_id:
 *                     type: string
 *                   user_id:
 *                     type: string
 *                   start_date:
 *                     type: string
 *                     format: date
 *                   end_date:
 *                     type: string
 *                     format: date
 *                   role_vi:
 *                     type: string
 *                   role_en:
 *                     type: string
 *                   department:
 *                     type: string
 */
router.get("/", userWorkController.getAllUserWorks);

/**
 * @swagger
 * /userworks/{user_id}:
 *   get:
 *     summary: Get user works by user ID
 *     tags: [UserWorks]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: List of user works for the specified user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   work_unit_id:
 *                     type: string
 *                   user_id:
 *                     type: string
 *                   start_date:
 *                     type: string
 *                     format: date
 *                   end_date:
 *                     type: string
 *                     format: date
 *                   role_vi:
 *                     type: string
 *                   role_en:
 *                     type: string
 *                   department:
 *                     type: string
 *       404:
 *         description: No user works found for this user ID
 */
router.get("/:user_id", userWorkController.getUserWorksByUserId);

/**
 * @swagger
 * /userworks/{id}:
 *   put:
 *     summary: Update a user work by ID
 *     tags: [UserWorks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user work ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               work_unit_id:
 *                 type: string
 *               user_id:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               role_vi:
 *                 type: string
 *               role_en:
 *                 type: string
 *               department:
 *                 type: string
 *     responses:
 *       200:
 *         description: User work updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User work not found
 */
router.put("/:id", userWorkController.updateUserWorkById);

/**
 * @swagger
 * /userworks/{id}:
 *   delete:
 *     summary: Delete a user work by ID
 *     tags: [UserWorks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user work ID
 *     responses:
 *       200:
 *         description: User work deleted successfully
 *       404:
 *         description: User work not found
 */
router.delete("/:id", userWorkController.deleteUserWorkById);
module.exports = router;