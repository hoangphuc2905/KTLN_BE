const Student = require("../models/Student");
const Lecturer = require("../models/Lecturer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Account = require("../models/Account");

const authController = {
  login: async (req, res) => {
    try {
      const { user_id, password } = req.body;

      // Tìm kiếm trong cả hai mô hình Student và Lecturer
      let user = await Student.findOne({ student_id: user_id });
      let role = "student";

      if (!user) {
        user = await Lecturer.findOne({ lecturer_id: user_id });
        role = "lecturer";
      }

      if (!user) {
        return res.status(400).json({ message: "Invalid user_id or password" });
      }

      const account = await Account.findOne({ user_id: user._id });
      const isPasswordValid = await bcrypt.compare(password, account.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid user_id or password" });
      }

      const token = jwt.sign(
        { userId: user._id, role },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      res.status(200).json({
        token,
        user_id: user_id,
        role: role,
        email: user.email,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
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

      const account = await Account.findOne({ user_id: user._id });
      const isPasswordValid = await bcrypt.compare(
        oldPassword,
        account.password
      );
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await Account.updateOne(
        { user_id: user._id },
        { password: hashedPassword }
      );

      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = authController;
