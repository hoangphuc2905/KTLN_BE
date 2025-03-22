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

      let user = await Student.findOne({ student_id: user_id, isActive: true });
      let roleNames = ["Student"];
      let userType = "Student";
      let userIdentifier = user?.student_id;
      let userIdField = "student_id";

      if (!user) {
        user = await Lecturer.findOne({
          lecturer_id: user_id,
          isActive: true,
        }).populate({
          path: "roles",
          select: "role_name",
        });
        roleNames = user?.roles?.map((role) => role.role_name) || ["Lecturer"];
        userType = "Lecturer";
        userIdentifier = user?.lecturer_id;
        userIdField = "lecturer_id";
      }

      if (!user) {
        return res.status(400).json({
          message: "Invalid user_id, password, or account is inactive",
        });
      }

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
        {
          userId: userIdentifier,
          roles: roleNames,
          user_type: userType,
          department: user.department,
        },
        process.env.MYSECRET,
        {
          expiresIn: "1h",
        }
      );

      res.status(200).json({
        token,
        [userIdField]: userIdentifier,
        roles: roleNames,
        email: user.email,
        user_type: userType,
        department: user.department,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getUserInfo: async (req, res) => {
    try {
      if (req.user.user_type === "Student") {
        req.params.student_id = req.user.userId;
        return studentControllers.getStudentById(req, res);
      } else if (req.user.user_type === "Lecturer") {
        req.params.lecturer_id = req.user.userId;
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

  updateUserInfo: async (req, res) => {
    try {
      console.log("Decoded user from token:", req.user);

      if (req.user.user_type === "Student") {
        req.params.student_id = req.user.userId;
        return studentControllers.updateStudentById(req, res);
      } else if (req.user.user_type === "Lecturer") {
        req.params.lecturer_id = req.user.userId;
        return lecturerController.updateLecturerById(req, res);
      } else {
        return res.status(400).json({ message: "Invalid user_type" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = authController;
