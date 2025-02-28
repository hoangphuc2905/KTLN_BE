const UserWork = require("../models/UserWork");

const userWorkController = {
  createUserWork: async (req, res) => {
    try {
      const userWork = new UserWork(req.body);
      await userWork.save();
      res.status(201).json(userWork);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getAllUserWorks: async (req, res) => {
    try {
      const userWorks = await UserWork.find()
        .populate("work_unit_id")
        .populate("user_id");
      res.status(200).json(userWorks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getUserWorkById: async (req, res) => {
    try {
      const userWork = await UserWork.findById(req.params.id)
        .populate("work_unit_id")
        .populate("user_id");
      if (!userWork) {
        return res.status(404).json({ message: "UserWork not found" });
      }
      res.status(200).json(userWork);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateUserWorkById: async (req, res) => {
    try {
      const userWork = await UserWork.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      )
        .populate("work_unit_id")
        .populate("user_id");
      if (!userWork) {
        return res.status(404).json({ message: "UserWork not found" });
      }
      res.status(200).json(userWork);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },


};

module.exports = userWorkController;
