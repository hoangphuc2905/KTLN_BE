const Student = require("../models/Student");
const Account = require("../models/Account");
const bcrypt = require("bcryptjs");
const studentController = {
  createStudent: async (req, res) => {
    try {
      // Tạo sinh viên
      const student = new Student(req.body);
      await student.save();

      // Tạo mật khẩu mặc định
      const defaultPassword = "1111";
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(defaultPassword, salt);

      // Tạo tài khoản cho sinh viên
      const account = new Account({
        user_id: student._id,
        user_type: "Student",
        password: hashedPassword
      });
      await account.save();
      res.status(201).json({
        message: "Student and account created successfully",
        student,
        account: {
          user_id: account.user_id,
          user_type: account.user_type
        }
      });
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  },
  getAllStudents: async (req, res) => {
    try {
      const students = await Student.find().populate({
        path: "department",
        select: "department_name"
      });
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
  getStudentById: async (req, res) => {
    try {
      const student = await Student.findOne({
        student_id: req.params.student_id
      });
      if (!student) {
        return res.status(404).json({
          message: "Student not found"
        });
      }
      res.status(200).json(student);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
  updateStudentById: async (req, res) => {
    try {
      const student = await Student.findOneAndUpdate({
        student_id: req.params.student_id
      }, req.body, {
        new: true,
        runValidators: true
      });
      if (!student) {
        return res.status(404).json({
          message: "Student not found"
        });
      }
      res.status(200).json(student);
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  },
  updateStatusStudentById: async (req, res) => {
    try {
      const student = await Student.findOneAndUpdate({
        student_id: req.params.student_id
      }, {
        isActive: req.body.isActive
      }, {
        new: true,
        runValidators: true
      });
      if (!student) {
        return res.status(404).json({
          message: "Student not found"
        });
      }
      res.status(200).json(student);
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  },
  deleteStudentById: async (req, res) => {
    try {
      const student = await Student.findOneAndDelete({
        student_id: req.params.student_id
      });
      if (!student) {
        return res.status(404).json({
          message: "Student not found"
        });
      }

      // Xóa tài khoản liên quan đến sinh viên
      await Account.findOneAndDelete({
        user_id: student._id
      });
      res.status(200).json({
        message: "Student and account deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
};
module.exports = studentController;