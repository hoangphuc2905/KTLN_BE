const PaperGroup = require("../models/PaperGroup");
const paperGroupController = {
  createPaperGroup: async (req, res) => {
    try {
      const {
        group_name
      } = req.body;
      const existingGroup = await PaperGroup.findOne({
        group_name
      });
      if (existingGroup) {
        return res.status(400).json({
          message: "Group name already exists"
        });
      }
      const paperGroup = new PaperGroup(req.body);
      await paperGroup.save();
      res.status(201).json(paperGroup);
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  },
  getAllPaperGroups: async (req, res) => {
    try {
      const paperGroups = await PaperGroup.find();
      res.status(200).json(paperGroups);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
  getPaperGroupById: async (req, res) => {
    try {
      const paperGroup = await PaperGroup.findById(req.params._id);
      if (!paperGroup) {
        return res.status(404).json({
          message: "Paper group not found"
        });
      }
      res.status(200).json(paperGroup);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
  updatePaperGroupById: async (req, res) => {
    try {
      const paperGroup = await PaperGroup.findByIdAndUpdate(req.params._id, req.body, {
        new: true,
        runValidators: true
      });
      if (!paperGroup) {
        return res.status(404).json({
          message: "Paper group not found"
        });
      }
      res.status(200).json(paperGroup);
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  },
  deletePaperGroupById: async (req, res) => {
    try {
      const paperGroup = await PaperGroup.findByIdAndDelete(req.params._id);
      if (!paperGroup) {
        return res.status(404).json({
          message: "Paper group not found"
        });
      }
      res.status(200).json({
        message: "Paper group deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
};
module.exports = paperGroupController;