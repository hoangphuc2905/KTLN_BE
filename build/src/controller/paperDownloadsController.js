const PaperDownloads = require("../models/PaperDownloads");
const mongoose = require("mongoose");
const paperDownloadsController = {
  createPaperDownload: async (req, res) => {
    try {
      const paperDownload = new PaperDownloads({
        download_id: new mongoose.Types.ObjectId(),
        ...req.body,
        download_time: new Date()
      });
      await paperDownload.save();
      res.status(201).json(paperDownload);
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  },
  getAllPaperDownloads: async (req, res) => {
    try {
      const paperDownloads = await PaperDownloads.find().populate("paper_id").populate({
        path: "user_id",
        model: req.body.user_type
      }); // Dynamically populate user_id based on user_type
      res.status(200).json(paperDownloads);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
  getPaperDownloadById: async (req, res) => {
    try {
      const paperDownload = await PaperDownloads.findById(req.params.id).populate("paper_id").populate({
        path: "user_id",
        model: req.body.user_type
      }); // Dynamically populate user_id based on user_type
      if (!paperDownload) {
        return res.status(404).json({
          message: "PaperDownload not found"
        });
      }
      res.status(200).json(paperDownload);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
  updatePaperDownloadById: async (req, res) => {
    try {
      const paperDownload = await PaperDownloads.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      }).populate("paper_id").populate({
        path: "user_id",
        model: req.body.user_type
      }); // Dynamically populate user_id based on user_type
      if (!paperDownload) {
        return res.status(404).json({
          message: "PaperDownload not found"
        });
      }
      res.status(200).json(paperDownload);
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  },
  deletePaperDownloadById: async (req, res) => {
    try {
      const paperDownload = await PaperDownloads.findByIdAndDelete(req.params.id);
      if (!paperDownload) {
        return res.status(404).json({
          message: "PaperDownload not found"
        });
      }
      res.status(200).json({
        message: "PaperDownload deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
  getDownloadCountByPaperId: async (req, res) => {
    try {
      const paperId = req.params.paper_id; // Lấy paper_id từ URL params
      const downloadCount = await PaperDownloads.countDocuments({
        paper_id: paperId
      });
      res.status(200).json({
        paper_id: paperId,
        download_count: downloadCount
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
};
module.exports = paperDownloadsController;