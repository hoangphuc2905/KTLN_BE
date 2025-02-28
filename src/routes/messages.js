const express = require("express");
const router = express.Router();
const messagesController = require("../controller/messagesController");

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Messages management endpoints
 */

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Create a new message
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message_id:
 *                 type: string
 *               message_type:
 *                 type: string
 *               status:
 *                 type: string
 *               sender_id:
 *                 type: string
 *               receiver_id:
 *                 type: string
 *               paper_id:
 *                 type: string
 *               content:
 *                 type: string
 *               time:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Message created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", messagesController.createMessage);

/**
 * @swagger
 * /messages:
 *   get:
 *     summary: Get all messages
 *     tags: [Messages]
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   message_id:
 *                     type: string
 *                   message_type:
 *                     type: string
 *                   status:
 *                     type: string
 *                   sender_id:
 *                     type: string
 *                   receiver_id:
 *                     type: string
 *                   paper_id:
 *                     type: string
 *                   content:
 *                     type: string
 *                   time:
 *                     type: string
 *                     format: date
 */
router.get("/", messagesController.getAllMessages);

/**
 * @swagger
 * /messages/{id}:
 *   get:
 *     summary: Get a message by ID
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The message ID
 *     responses:
 *       200:
 *         description: Message details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message_id:
 *                   type: string
 *                 message_type:
 *                   type: string
 *                 status:
 *                   type: string
 *                 sender_id:
 *                   type: string
 *                 receiver_id:
 *                   type: string
 *                 paper_id:
 *                   type: string
 *                 content:
 *                   type: string
 *                 time:
 *                   type: string
 *                   format: date
 *       404:
 *         description: Message not found
 */
router.get("/:id", messagesController.getMessageById);

/**
 * @swagger
 * /messages/{id}:
 *   put:
 *     summary: Update a message by ID
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The message ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message_id:
 *                 type: string
 *               message_type:
 *                 type: string
 *               status:
 *                 type: string
 *               sender_id:
 *                 type: string
 *               receiver_id:
 *                 type: string
 *               paper_id:
 *                 type: string
 *               content:
 *                 type: string
 *               time:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Message updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Message not found
 */
router.put("/:id", messagesController.updateMessageById);


module.exports = router;