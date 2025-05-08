const PaperViews = require("../models/PaperViews");
const mongoose = require("mongoose");

const paperViewsController = {
  createPaperView: async (req, res) => {
    try {
      const paperView = new PaperViews({
        view_id: new mongoose.Types.ObjectId(),
        ...req.body,
        view_time: new Date(),
      });
      await paperView.save();
      console.log("PaperView created:", paperView);
      res.status(201).json(paperView);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getAllPaperViews: async (req, res) => {
    try {
      const paperViews = await PaperViews.find()
        .populate("paper_id")
        .populate({ path: "user_id", model: (doc) => doc.user_type });
      res.status(200).json(paperViews);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getPaperViewById: async (req, res) => {
    try {
      const paperView = await PaperViews.findById(req.params.id)
        .populate("paper_id")
        .populate({ path: "user_id", model: (doc) => doc.user_type });
      if (!paperView) {
        return res.status(404).json({ message: "PaperView not found" });
      }
      res.status(200).json(paperView);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updatePaperViewById: async (req, res) => {
    try {
      const { view_id, paper_id, user_type, user_id, view_time } = req.body;
      const paperView = await PaperViews.findByIdAndUpdate(
        req.params.id,
        { view_id, paper_id, user_type, user_id, view_time },
        { new: true, runValidators: true }
      )
        .populate("paper_id")
        .populate({ path: "user_id", model: (doc) => doc.user_type });
      if (!paperView) {
        return res.status(404).json({ message: "PaperView not found" });
      }
      res.status(200).json(paperView);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getViewCountByPaperId: async (req, res) => {
    try {
      const { paper_id } = req.params;
      const viewCount = await PaperViews.countDocuments({ paper_id });
      res.status(200).json({ viewCount });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAllPaperViewsByUser: async (req, res) => {
    try {
      const { user_id } = req.params;
  
      // Sử dụng aggregation để lấy bài báo mới nhất cho mỗi paper_id
      const paperViews = await PaperViews.aggregate([
        { $match: { user_id: user_id } }, // Lọc theo user_id
        { $sort: { view_time: -1 } }, // Sắp xếp theo thời gian xem (mới nhất trước)
        {
          $group: {
            _id: "$paper_id", // Nhóm theo paper_id
            latestView: { $first: "$$ROOT" }, // Lấy bản ghi mới nhất trong nhóm
          },
        },
        {
          $replaceRoot: { newRoot: "$latestView" }, // Thay thế root bằng bản ghi mới nhất
        },
      ]);
  
      // Populate các trường liên quan
      const populatedViews = await PaperViews.populate(paperViews, {
        path: "paper_id",
        populate: [
          { path: "author", select: "author_name_vi" },
          { path: "department", select: "department_name" },
        ],
      });
  
      if (!populatedViews || populatedViews.length === 0) {
        return res
          .status(404)
          .json({ message: "No paper views found for this user" });
      }
  
      res.status(200).json(populatedViews);
    } catch (error) {
      console.error("Error fetching paper views:", error);
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = paperViewsController;
