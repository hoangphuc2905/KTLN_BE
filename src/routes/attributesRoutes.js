const express = require("express");
const router = express.Router();
const attributeController = require("../controller/attributeController");

/**
 * @swagger
 * tags:
 *   name: Attributes
 *   description: Attribute management endpoints
 */

/**
 * @swagger
 * /attributes:
 *   post:
 *     summary: Create a new attribute
 *     tags: [Attributes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               name:
 *                 type: string
 *               values:
 *                 type: object
 *                 additionalProperties:
 *                   type: number
 *           examples:
 *             example:
 *               value:
 *                 startDate: "2025-01-01"
 *                 endDate: "2025-12-31"
 *                 name: "theonhom"
 *                 values:
 *                   Q1: 1
 *                   Q2: 2
 *                   Q3: 3
 *     responses:
 *       201:
 *         description: Attribute created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", attributeController.createAttribute);

/**
 * @swagger
 * /attributes:
 *   get:
 *     summary: Lấy tất cả các attributes
 *     tags: [Attributes]
 *     responses:
 *       200:
 *         description: Danh sách tất cả các attributes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Lỗi server
 */
router.get("/", attributeController.getAllAttributes);

/**
 * @swagger
 * /attributes/id:
 *   post:
 *     summary: Lấy tên của Attribute theo id
 *     tags: [Attributes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID của Attribute
 *           examples:
 *             example:
 *               value:
 *                 id: "67dfbf7f2271a42ac8d8beee"
 *     responses:
 *       200:
 *         description: Tên của Attribute
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *       404:
 *         description: Không tìm thấy Attribute
 *       500:
 *         description: Lỗi server
 */
router.post("/id", attributeController.getAttributeById);

/**
 * @swagger
 * /attributes/{name}:
 *   put:
 *     summary: Update attributes by name
 *     tags: [Attributes]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the attribute
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               values:
 *                 type: object
 *                 additionalProperties:
 *                   type: number
 *           examples:
 *             example:
 *               value:
 *                 startDate: "2025-01-01"
 *                 endDate: "2025-12-31"
 *                 values:
 *                   Q1: 1
 *                   Q2: 2
 *                   Q3: 3
 *     responses:
 *       200:
 *         description: Attribute updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Attribute not found
 */
router.put("/:name", attributeController.updateAttributeByName);

/**
 * @swagger
 * /attributes/{name}:
 *   delete:
 *     summary: Delete attributes by name
 *     tags: [Attributes]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the attribute
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               confirmation:
 *                 type: boolean
 *           examples:
 *             example:
 *               value:
 *                 confirmation: true
 *     responses:
 *       200:
 *         description: Attribute deleted successfully
 *       404:
 *         description: Attribute not found
 */
router.delete("/:name", attributeController.deleteAttributeByName);

module.exports = router;
