const jwt = require("jsonwebtoken");

const authMiddleware = {
  authenticate: (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    try {
      const decoded = jwt.verify(token, process.env.MYSECRET); // Giải mã token
      req.user = decoded; // Gắn thông tin từ token vào req.user
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  },
};

module.exports = authMiddleware;
