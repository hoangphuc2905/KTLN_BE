const Student = require("../models/Student");

const studentController = {
  createStudent: async (req, res) => {
    try {
      const student = new Student(req.body);
      await student.save();
      res.status(201).json(student);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getAllStudents: async (req, res) => {
    try {
      const students = await Student.find();
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getStudentById: async (req, res) => {
    try {
      const student = await Student.findOne({ user_id: req.params.user_id });
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.status(200).json(student);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateStudentById: async (req, res) => {
    try {
      const student = await Student.findOneAndUpdate(
        { user_id: req.params.user_id },
        req.body,
        { new: true, runValidators: true }
      );
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.status(200).json(student);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = studentController;
