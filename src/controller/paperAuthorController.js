const PaperAuthor = require("../models/PaperAuthor");

const paperAuthorController = {
  createPaperAuthor: async (req, res) => {
    try {
      const paperAuthor = new PaperAuthor(req.body);
      await paperAuthor.save();
      res.status(201).json(paperAuthor);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getAllPaperAuthors: async (req, res) => {
    try {
      const paperAuthors = await PaperAuthor.find().populate('paper_id').populate('user_id').populate('work_unit_id');
      res.status(200).json(paperAuthors);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getPaperAuthorById: async (req, res) => {
    try {
      const paperAuthor = await PaperAuthor.findById(req.params.id).populate('paper_id').populate('user_id').populate('work_unit_id');
      if (!paperAuthor) {
        return res.status(404).json({ message: "PaperAuthor not found" });
      }
      res.status(200).json(paperAuthor);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updatePaperAuthorById: async (req, res) => {
    try {
      const paperAuthor = await PaperAuthor.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).populate('paper_id').populate('user_id').populate('work_unit_id');
      if (!paperAuthor) {
        return res.status(404).json({ message: "PaperAuthor not found" });
      }
      res.status(200).json(paperAuthor);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },


};

module.exports = paperAuthorController;