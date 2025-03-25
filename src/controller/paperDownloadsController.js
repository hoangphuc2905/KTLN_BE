const PaperDownloads = require("../models/PaperDownloads");

const paperDownloadsController = {
  createPaperDownload: async (req, res) => {
    try {
      const paperDownload = new PaperDownloads({
        ...req.body,
        download_time: new Date(), // Ensure download_time is set
      });
      await paperDownload.save();
      res.status(201).json(paperDownload);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getAllPaperDownloads: async (req, res) => {
    try {
      const paperDownloads = await PaperDownloads.find()
        .populate("paper_id")
        .populate("user_id"); // user_id is an array, populate handles it
      res.status(200).json(paperDownloads);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getPaperDownloadById: async (req, res) => {
    try {
      const paperDownload = await PaperDownloads.findById(req.params.id)
        .populate("paper_id")
        .populate("user_id"); // user_id is an array, populate handles it
      if (!paperDownload) {
        return res.status(404).json({ message: "PaperDownload not found" });
      }
      res.status(200).json(paperDownload);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updatePaperDownloadById: async (req, res) => {
    try {
      const paperDownload = await PaperDownloads.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      )
        .populate("paper_id")
        .populate("user_id"); // user_id is an array, populate handles it
      if (!paperDownload) {
        return res.status(404).json({ message: "PaperDownload not found" });
      }
      res.status(200).json(paperDownload);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deletePaperDownloadById: async (req, res) => {
    try {
      const paperDownload = await PaperDownloads.findByIdAndDelete(
        req.params.id
      );
      if (!paperDownload) {
        return res.status(404).json({ message: "PaperDownload not found" });
      }
      res.status(200).json({ message: "PaperDownload deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = paperDownloadsController;
