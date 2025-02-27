const ScientificPaper = require("../models/ScientificPaper");

const scientificPaperController = {
  createScientificPaper: async (req, res) => {
    try {
      const scientificPaper = new ScientificPaper(req.body);
      await scientificPaper.save();
      res.status(201).json(scientificPaper);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getAllScientificPapers: async (req, res) => {
    try {
      const scientificPapers = await ScientificPaper.find()
        .populate("article_type")
        .populate("article_group")
        .populate("views")
        .populate("downloads");
      res.status(200).json(scientificPapers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getScientificPaperById: async (req, res) => {
    try {
      const scientificPaper = await ScientificPaper.findById(req.params.id)
        .populate("article_type")
        .populate("article_group")
        .populate("views")
        .populate("downloads");
      if (!scientificPaper) {
        return res.status(404).json({ message: "ScientificPaper not found" });
      }
      res.status(200).json(scientificPaper);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateScientificPaperById: async (req, res) => {
    try {
      const scientificPaper = await ScientificPaper.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      )
        .populate("article_type")
        .populate("article_group")
        .populate("views")
        .populate("downloads");
      if (!scientificPaper) {
        return res.status(404).json({ message: "ScientificPaper not found" });
      }
      res.status(200).json(scientificPaper);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteScientificPaperById: async (req, res) => {
    try {
      const scientificPaper = await ScientificPaper.findByIdAndDelete(
        req.params.id
      );
      if (!scientificPaper) {
        return res.status(404).json({ message: "ScientificPaper not found" });
      }
      res.status(200).json({ message: "ScientificPaper deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = scientificPaperController;
