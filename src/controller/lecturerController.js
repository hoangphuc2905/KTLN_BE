const Lecturer = require("../models/Lecturer");
const Student = require("../models/Student");
const Account = require("../models/Account");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const lecturerController = {
  createLecturer: async (req, res) => {
    try {
      // Tạo giảng viên
      const lecturer = new Lecturer(req.body);
      await lecturer.save();

      // Tạo mật khẩu mặc định
      const defaultPassword = "1111";
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(defaultPassword, salt);

      // Tạo tài khoản cho giảng viên
      const account = new Account({
        user_id: lecturer._id,
        user_type: "Lecturer",
        password: hashedPassword,
      });
      await account.save();

      res.status(201).json({
        message: "Lecturer and account created successfully",
        lecturer,
        account: {
          user_id: account.user_id,
          user_type: account.user_type,
        },
      });
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
      const lecturer = await Lecturer.findById(req.user.userId).populate({
        path: "roles",
        select: "role_name",
      });
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
        { _id: req.user.userId },
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

  updateStatusLecturerById: async (req, res) => {
    try {
      const lecturer = await Lecturer.findOneAndUpdate(
        { lecturer_id: req.params.lecturer_id },
        { isActive: req.body.isActive },
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

  getLecturerAndStudentByDepartment: async (req, res) => {
    try {
      const departmentId = req.params.department_id;

      if (!mongoose.Types.ObjectId.isValid(departmentId)) {
        return res.status(400).json({ message: "Invalid department ID" });
      }

      const lecturers = await Lecturer.find({ department: departmentId })
        .select(
          "lecturer_id full_name email phone gender date_of_birth department roles score_year avatar degree isActive"
        )
        .populate("department", "department_name")
        .populate("roles", "role_name");

      const students = await Student.find({ department: departmentId })
        .select(
          "student_id full_name email phone gender date_of_birth department score_year avatar role degree isActive"
        )
        .populate("department", "department_name");

      res.status(200).json({
        lecturers,
        students,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
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

      await Account.findOneAndDelete({ user_id: lecturer._id });

      res
        .status(200)
        .json({ message: "Lecturer and account deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = lecturerController;
