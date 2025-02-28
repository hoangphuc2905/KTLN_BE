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
 * /userWorks:
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
 * /userWorks:
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
 * /userWorks/{id}:
 *   get:
 *     summary: Get a user work by ID
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
 *         description: User work details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 work_unit_id:
 *                   type: string
 *                 user_id:
 *                   type: string
 *                 start_date:
 *                   type: string
 *                   format: date
 *                 end_date:
 *                   type: string
 *                   format: date
 *                 role_vi:
 *                   type: string
 *                 role_en:
 *                   type: string
 *                 department:
 *                   type: string
 *       404:
 *         description: User work not found
 */
router.get("/:id", userWorkController.getUserWorkById);

/**
 * @swagger
 * /userWorks/{id}:
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


module.exports = router;