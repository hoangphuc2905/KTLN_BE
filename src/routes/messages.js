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
 * /messages/receiver/{receiverId}:
 *   get:
 *     summary: Lấy tất cả thông báo dành cho một người nhận cụ thể
 *     tags:
 *       - Messages
 *     parameters:
 *       - in: path
 *         name: receiverId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người nhận
 *     responses:
 *       200:
 *         description: Thành công, trả về danh sách thông báo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   sender_id:
 *                     type: object
 *                     description: Thông tin người gửi
 *                   receiver_id:
 *                     type: object
 *                     description: Thông tin người nhận
 *                   paper_id:
 *                     type: object
 *                     description: Thông tin bài báo
 *                   content:
 *                     type: string
 *                   time:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Không tìm thấy thông báo cho người nhận này
 *       500:
 *         description: Lỗi xử lý trên server
 */
router.get("/receiver/:receiverId", messagesController.getMessagesByReceiverId);

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

/**
 * @swagger
 * /messages/{id}:
 *   delete:
 *     summary: Delete a message by ID
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
 *         description: Message deleted successfully
 *       404:
 *         description: Message not found
 */
router.delete("/:id", messagesController.deleteMessageById);

module.exports = router;
