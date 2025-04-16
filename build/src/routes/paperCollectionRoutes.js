const express = require("express");
const router = express.Router();
const paperCollectionController = require("../controller/paperCollectionController");

/**
 * @swagger
 * /papercollections:
 *   post:
 *     summary: Create a new paper collection
 *     tags: [PaperCollections]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the collection
 *               user_type:
 *                 type: string
 *                 enum: ["Lecturer", "Student"]
 *                 description: Type of the user creating the collection
 *               user_id:
 *                 type: string
 *                 description: ID of the user creating the collection
 *     responses:
 *       201:
 *         description: Collection created successfully
 *       400:
 *         description: Collection with this name already exists
 *       500:
 *         description: Internal server error
 */
router.post("/", paperCollectionController.createCollection);

/**
 * @swagger
 * /papercollections/{id}:
 *   put:
 *     summary: Update a paper collection
 *     tags: [PaperCollections]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the collection to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New name of the collection
 *     responses:
 *       200:
 *         description: Collection updated successfully
 *       404:
 *         description: Collection not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", paperCollectionController.updateCollection);

/**
 * @swagger
 * /papercollections/{user_id}:
 *   get:
 *     summary: Get all collections of a user
 *     tags: [PaperCollections]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of collections retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get("/:user_id", paperCollectionController.getCollectionsByUserId);

/**
 * @swagger
 * /papercollections/check/{user_id}/{paper_id}:
 *   get:
 *     summary: Check if a paper is in any collection of a user
 *     tags: [PaperCollections]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *       - in: path
 *         name: paper_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the paper to check
 *     responses:
 *       200:
 *         description: Returns whether the paper exists in a collection
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                   description: Whether the paper exists in a collection
 *                 collection_id:
 *                   type: string
 *                   description: ID of the collection containing the paper (if exists)
 *       500:
 *         description: Internal server error
 */
router.get("/check/:user_id/:paper_id", paperCollectionController.isPaperInCollection);

/**
 * @swagger
 * /papercollections/addpaper:
 *   post:
 *     summary: Add a paper to a collection
 *     tags: [PaperCollections]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               collection_id:
 *                 type: string
 *                 description: ID of the collection
 *               paper_id:
 *                 type: string
 *                 description: ID of the paper to add
 *     responses:
 *       200:
 *         description: Paper added to collection successfully
 *       400:
 *         description: Paper already exists in the collection
 *       404:
 *         description: Collection not found
 *       500:
 *         description: Internal server error
 */
router.post("/addpaper", paperCollectionController.addPaperToCollection);

/**
 * @swagger
 * /papercollections/removepaper:
 *   post:
 *     summary: Remove a paper from a collection
 *     tags: [PaperCollections]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               collection_id:
 *                 type: string
 *                 description: ID of the collection
 *               paper_id:
 *                 type: string
 *                 description: ID of the paper to remove
 *     responses:
 *       200:
 *         description: Paper removed from collection successfully
 *       404:
 *         description: Collection not found
 *       500:
 *         description: Internal server error
 */
router.post("/removepaper", paperCollectionController.removePaperFromCollection);

/**
 * @swagger
 * /papercollections/{id}:
 *   delete:
 *     summary: Delete a paper collection
 *     tags: [PaperCollections]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the collection to delete
 *     responses:
 *       200:
 *         description: Collection deleted successfully
 *       404:
 *         description: Collection not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", paperCollectionController.deleteCollection);
module.exports = router;