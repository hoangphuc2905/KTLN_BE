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
      req.user = decoded;

      // Kiểm tra quyền hạn (nếu cần)
      if (!req.user.userId || !req.user.user_type) {
        return res
          .status(403)
          .json({ message: "Access denied. Invalid token." });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  },
};

module.exports = authMiddleware;
