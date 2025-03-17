const Lecturer = require("../models/Lecturer");

const lecturerController = {
  createLecturer: async (req, res) => {
    try {
      const lecturer = new Lecturer(req.body);
      await lecturer.save();
      res.status(201).json(lecturer);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getAllLecturers: async (req, res) => {
    try {
      const lecturers = await Lecturer.find().populate("department roles");
      res.status(200).json(lecturers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getLecturerById: async (req, res) => {
    try {
      const lecturer = await Lecturer.findOne({
        lecturer_id: req.params.lecturer_id,
      }).populate("department roles");
      if (!lecturer) {
        return res.status(404).json({ message: "Lecturer not found" });
      }
      res.status(200).json(lecturer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateLecturerById: async (req, res) => {
    try {
      const lecturer = await Lecturer.findOneAndUpdate(
        { lecturer_id: req.params.lecturer_id },
        req.body,
        { new: true, runValidators: true }
      ).populate("department roles");
      if (!lecturer) {
        return res.status(404).json({ message: "Lecturer not found" });
      }
      res.status(200).json(lecturer);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteLecturerById: async (req, res) => {
    try {
      const lecturer = await Lecturer.findOneAndDelete({
        lecturer_id: req.params.lecturer_id,
      });
      if (!lecturer) {
        return res.status(404).json({ message: "Lecturer not found" });
      }
      res.status(200).json({ message: "Lecturer deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = lecturerController;
