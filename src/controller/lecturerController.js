const Lecturer = require("../models/Lecturer");
const Account = require("../models/Account");
const bcrypt = require("bcryptjs");

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

      // Xóa tài khoản liên quan đến giảng viên
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
