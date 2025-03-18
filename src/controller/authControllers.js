const Student = require("../models/Student");
const Lecturer = require("../models/Lecturer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Account = require("../models/Account");
const studentControllers = require("./studentControllers");
const lecturerController = require("./lecturerController");

const authController = {
  login: async (req, res) => {
    try {
      const { user_id, password } = req.body;

      // Tìm kiếm trong bảng Student
      let user = await Student.findOne({ student_id: user_id });
      let roleName = "Student"; // Mặc định là Student

      if (!user) {
        // Nếu không tìm thấy trong Student, tìm trong Lecturer
        user = await Lecturer.findOne({ lecturer_id: user_id }).populate({
          path: "roles", // Nếu Lecturer có bảng roles liên kết
          select: "role_name",
        });
        roleName = user?.roles?.[0]?.role_name || "Lecturer"; // Lấy role từ Lecturer
      } else {
        // Nếu là Student, lấy role trực tiếp từ trường role
        roleName = user.role || "Student";
      }

      if (!user) {
        return res.status(400).json({ message: "Invalid user_id or password" });
      }

      // Tìm tài khoản trong bảng Account
      const account = await Account.findOne({ user_id: user._id });
      if (!account) {
        return res.status(400).json({ message: "Account not found" });
      }

      // Kiểm tra mật khẩu
      const isPasswordValid = await bcrypt.compare(password, account.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid user_id or password" });
      }

      // Tạo token JWT
      const token = jwt.sign(
        { userId: user._id, roles: [roleName], user_type: account.user_type }, // Thêm user_type vào token
        process.env.MYSECRET,
        {
          expiresIn: "1h",
        }
      );

      res.status(200).json({
        token,
        user_id: user_id,
        roles: [roleName],
        email: user.email,
        user_type: account.user_type,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getUserInfo: async (req, res) => {
    try {
      if (req.user.user_type === "Student") {
        return studentControllers.getStudentById(req, res);
      } else if (req.user.user_type === "Lecturer") {
        return lecturerController.getLecturerById(req, res);
      } else {
        return res.status(400).json({ message: "Invalid user_type" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  changePassword: async (req, res) => {
    try {
      const { user_id, oldPassword, newPassword } = req.body;

      // Tìm kiếm trong cả hai mô hình Student và Lecturer
      let user = await Student.findOne({ student_id: user_id });
      if (!user) {
        user = await Lecturer.findOne({ lecturer_id: user_id });
      }

      if (!user) {
        return res.status(400).json({ message: "Invalid user_id" });
      }

      // Tìm tài khoản trong mô hình Account
      const account = await Account.findOne({ user_id: user._id });
      if (!account) {
        return res.status(400).json({ message: "Account not found" });
      }

      // Kiểm tra mật khẩu cũ
      const isPasswordValid = await bcrypt.compare(
        oldPassword,
        account.password
      );
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password" });
      }

      // Cập nhật mật khẩu mới
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      account.password = hashedPassword;
      await account.save();

      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = authController;
