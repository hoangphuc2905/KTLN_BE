const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Account = require("../models/Account");

const authController = {
  login: async (req, res) => {
    try {
      const { user_id, password } = req.body;

      const user = await User.findOne({ user_id });
      if (!user) {
        return res.status(400).json({ message: "Invalid user_id or password" });
      }

      const account = await Account.findOne({ user_id: user._id });
      const isPasswordValid = await bcrypt.compare(password, account.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid user_id or password" });
      }

      const token = jwt.sign({ userId: user._id }, process.env.MYSECRET, {
        expiresIn: "1h",
      });

      res.status(200).json({
        token,
        user_id: user.user_id,
        role: user.role_id,
        email: user.email,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Middleware to protect routes
  authenticate: (req, res, next) => {
    const token = req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Access denied" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(400).json({ message: "Invalid token" });
    }
  },

  changePassword: async (req, res) => {
    try {
      const { user_id, oldPassword, newPassword } = req.body;

      const user = await User.findOne({ user_id });
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
