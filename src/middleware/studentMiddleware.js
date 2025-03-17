const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

const studentAuthMiddleware = {
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

  authorize: (roles) => {
    return async (req, res, next) => {
      try {
        const { userId, role } = req.user;

        if (role !== "student") {
          return res.status(403).json({ message: "Access denied" });
        }

        const user = await Student.findById(userId);
        if (!user) {
          return res.status(403).json({ message: "Access denied" });
        }

        next();
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    };
  },
};

module.exports = studentAuthMiddleware;