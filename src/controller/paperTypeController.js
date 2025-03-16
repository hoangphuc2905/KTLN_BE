const PaperType = require("../models/PaperType");

const paperTypeController = {
  createPaperType: async (req, res) => {
    try {
      const paperType = new PaperType(req.body);
      await paperType.save();
      res.status(201).json(paperType);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getAllPaperTypes: async (req, res) => {
    try {
      const paperTypes = await PaperType.find();
      res.status(200).json(paperTypes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getPaperTypeById: async (req, res) => {
    try {
      const paperType = await PaperType.findById(req.params.type_id);
      if (!paperType) {
        return res.status(404).json({ message: "Paper type not found" });
      }
      res.status(200).json(paperType);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updatePaperTypeById: async (req, res) => {
    try {
      const paperType = await PaperType.findByIdAndUpdate(
        req.params.type_id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!paperType) {
        return res.status(404).json({ message: "Paper type not found" });
      }
      res.status(200).json(paperType);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = paperTypeController;
