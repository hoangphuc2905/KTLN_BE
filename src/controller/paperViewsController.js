const PaperViews = require("../models/PaperViews");

const paperViewsController = {
  createPaperView: async (req, res) => {
    try {
      const { view_id, paper_id, user_id, view_time } = req.body;
      const paperView = new PaperViews({
        view_id,
        paper_id,
        user_id,
        view_time,
      });
      await paperView.save();
      res.status(201).json(paperView);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getAllPaperViews: async (req, res) => {
    try {
      const paperViews = await PaperViews.find()
        .populate("paper_id")
        .populate("user_id");
      res.status(200).json(paperViews);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getPaperViewById: async (req, res) => {
    try {
      const paperView = await PaperViews.findById(req.params.id)
        .populate("paper_id")
        .populate("user_id");
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
      const { view_id, paper_id, user_id, view_time } = req.body;
      const paperView = await PaperViews.findByIdAndUpdate(
        req.params.id,
        { view_id, paper_id, user_id, view_time },
        { new: true, runValidators: true }
      )
        .populate("paper_id")
        .populate("user_id");
      if (!paperView) {
        return res.status(404).json({ message: "PaperView not found" });
      }
      res.status(200).json(paperView);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = paperViewsController;
