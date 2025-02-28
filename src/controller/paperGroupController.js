const PaperGroup = require("../models/PaperGroup");

const paperGroupController = {
  createPaperGroup: async (req, res) => {
    try {
      const paperGroup = new PaperGroup(req.body);
      await paperGroup.save();
      res.status(201).json(paperGroup);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getAllPaperGroups: async (req, res) => {
    try {
      const paperGroups = await PaperGroup.find();
      res.status(200).json(paperGroups);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getPaperGroupById: async (req, res) => {
    try {
      const paperGroup = await PaperGroup.findOne({ group_id: req.params.group_id });
      if (!paperGroup) {
        return res.status(404).json({ message: "PaperGroup not found" });
      }
      res.status(200).json(paperGroup);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updatePaperGroupById: async (req, res) => {
    try {
      const paperGroup = await PaperGroup.findOneAndUpdate(
        { group_id: req.params.group_id },
        req.body,
        { new: true, runValidators: true }
      );
      if (!paperGroup) {
        return res.status(404).json({ message: "PaperGroup not found" });
      }
      res.status(200).json(paperGroup);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

};

module.exports = paperGroupController;