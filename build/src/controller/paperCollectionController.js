const PaperCollection = require("../models/PaperCollection");
const paperCollectionController = {
  createCollection: async (req, res) => {
    try {
      const {
        name,
        user_type,
        user_id
      } = req.body;
      const existingCollection = await PaperCollection.findOne({
        name,
        user_type,
        user_id
      });
      if (existingCollection) {
        return res.status(400).json({
          message: "Collection with this name already exists."
        });
      }
      const collection = new PaperCollection({
        name,
        user_type,
        user_id
      });
      await collection.save();
      res.status(201).json({
        message: "Collection created successfully.",
        collection
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
  updateCollection: async (req, res) => {
    try {
      const {
        id
      } = req.params;
      const {
        name
      } = req.body;
      const collection = await PaperCollection.findByIdAndUpdate(id, {
        name
      }, {
        new: true,
        runValidators: true
      });
      if (!collection) {
        return res.status(404).json({
          message: "Collection not found."
        });
      }
      res.status(200).json({
        message: "Collection updated successfully.",
        collection
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
  getCollectionsByUserId: async (req, res) => {
    try {
      const {
        user_id
      } = req.params;
      const collections = await PaperCollection.find({
        user_id
      }).populate({
        path: "papers",
        populate: [{
          path: "article_type"
        }, {
          path: "article_group"
        }, {
          path: "author"
        }, {
          path: "department"
        }, {
          path: "downloads"
        }, {
          path: "views"
        }]
      });
      res.status(200).json(collections);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
  isPaperInCollection: async (req, res) => {
    try {
      const {
        user_id,
        paper_id
      } = req.params;

      // Tìm bộ sưu tập chứa bài viết
      const collection = await PaperCollection.findOne({
        user_id,
        papers: paper_id // Kiểm tra xem paper_id có trong mảng papers không
      });
      if (collection) {
        return res.status(200).json({
          exists: true,
          collection_id: collection._id
        });
      }
      res.status(200).json({
        exists: false
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
  addPaperToCollection: async (req, res) => {
    try {
      const {
        collection_id,
        paper_id
      } = req.body;
      const collection = await PaperCollection.findById(collection_id);
      if (!collection) {
        return res.status(404).json({
          message: "Collection not found."
        });
      }
      if (collection.papers.includes(paper_id)) {
        return res.status(400).json({
          message: "Paper already exists in the collection."
        });
      }
      collection.papers.push(paper_id);
      await collection.save();
      res.status(200).json({
        message: "Paper added to collection successfully.",
        collection
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
  removePaperFromCollection: async (req, res) => {
    try {
      const {
        collection_id,
        paper_id
      } = req.body;
      const collection = await PaperCollection.findById(collection_id);
      if (!collection) {
        return res.status(404).json({
          message: "Collection not found."
        });
      }

      // Xóa bài báo khỏi bộ sưu tập
      collection.papers = collection.papers.filter(id => id.toString() !== paper_id);
      await collection.save();
      res.status(200).json({
        message: "Paper removed from collection successfully.",
        collection
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
  // Xóa bộ sưu tập
  deleteCollection: async (req, res) => {
    try {
      const {
        id
      } = req.params;
      const deletedCollection = await PaperCollection.findByIdAndDelete(id);
      if (!deletedCollection) {
        return res.status(404).json({
          message: "Collection not found."
        });
      }
      res.status(200).json({
        message: "Collection deleted successfully."
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
};
module.exports = paperCollectionController;