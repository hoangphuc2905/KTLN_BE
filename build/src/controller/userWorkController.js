const UserWork = require("../models/UserWork");
const userWorkController = {
  createUserWork: async (req, res) => {
    try {
      const userWork = new UserWork(req.body);
      await userWork.save();
      res.status(201).json(userWork);
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  },
  getAllUserWorks: async (req, res) => {
    try {
      const userWorks = await UserWork.find().populate("work_unit_id").populate("user_id");
      res.status(200).json(userWorks);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
  getUserWorksByUserId: async (req, res) => {
    try {
      const userWorks = await UserWork.find({
        user_id: req.params.user_id
      });
      if (userWorks.length === 0) {
        return res.status(404).json({
          message: "No user works found for this user_id"
        });
      }
      res.status(200).json(userWorks);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
  updateUserWorkById: async (req, res) => {
    try {
      const updated = await UserWork.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      if (!updated) {
        return res.status(404).json({
          message: "UserWork not found"
        });
      }
      const userWork = await UserWork.findById(updated._id);
      res.status(200).json(userWork);
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  },
  deleteUserWorkById: async (req, res) => {
    try {
      const userWork = await UserWork.findByIdAndDelete(req.params.id);
      if (!userWork) {
        return res.status(404).json({
          message: "UserWork not found"
        });
      }
      res.status(200).json({
        message: "UserWork deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
};
module.exports = userWorkController;