const Student = require("../models/Student");
const Lecturer = require("../models/Lecturer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Account = require("../models/Account");
const UserToken = require("../models/UserToken");
const studentControllers = require("./studentControllers");
const lecturerController = require("./lecturerController");
const nodemailer = require("nodemailer");

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
          message: "Tài khoản không tồn tại hoặc đã bị khóa",
        });
      }

      const account = await Account.findOne({ user_id: user._id });
      if (!account) {
        return res.status(400).json({ message: "Tài khoản không tồn tại" });
      }

      // Kiểm tra mật khẩu
      const isPasswordValid = await bcrypt.compare(password, account.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Mật khẩu không đúng" });
      }

      // Tạo Access Token (thời gian sống ngắn: 15 phút)
      const accessToken = jwt.sign(
        {
          userId: userIdentifier,
          roles: roleNames,
          user_type: userType,
          department: user.department,
        },
        process.env.MYSECRET,
        { expiresIn: "15m" }
      );

      // Tạo Refresh Token (thời gian sống dài: 7 ngày)
      const refreshToken = jwt.sign(
        { userId: userIdentifier, user_type: userType },
        process.env.MYREFRESHSECRET,
        { expiresIn: "7d" }
      );

      // Xóa Refresh Token cũ và lưu Refresh Token mới
      const newToken = await UserToken.create({
        user_id: account._id,
        token: refreshToken,
      });

      res.status(200).json({
        accessToken,
        refreshToken,
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

  refreshToken: async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    try {
      const tokenDoc = await UserToken.findOne({ token: refreshToken });
      if (!tokenDoc) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      // Xác minh Refresh Token
      const decoded = jwt.verify(refreshToken, process.env.MYREFRESHSECRET);
      const userId = decoded.userId;

      // Tìm lại thông tin người dùng để tạo Access Token mới
      let user = await Student.findOne({ student_id: userId, isActive: true });
      let roleNames = ["Student"];
      let userType = "Student";
      let department = user?.department;

      if (!user) {
        user = await Lecturer.findOne({
          lecturer_id: userId,
          isActive: true,
        }).populate({
          path: "roles",
          select: "role_name",
        });
        roleNames = user?.roles?.map((role) => role.role_name) || ["Lecturer"];
        userType = "Lecturer";
        department = user?.department;
      }

      if (!user) {
        return res.status(403).json({ message: "User not found" });
      }

      // Tạo Access Token mới
      const accessToken = jwt.sign(
        {
          userId: userId,
          roles: roleNames,
          user_type: userType,
          department: department,
        },
        process.env.MYSECRET,
        { expiresIn: "15m" }
      );

      res.status(200).json({ accessToken });
    } catch (error) {
      res.status(403).json({ message: "Refresh token expired or invalid" });
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

      let user = await Student.findOne({ student_id: user_id });
      if (!user) {
        user = await Lecturer.findOne({ lecturer_id: user_id });
      }

      if (!user) {
        return res.status(400).json({ message: "Invalid user_id" });
      }

      const account = await Account.findOne({ user_id: user._id });
      if (!account) {
        return res.status(400).json({ message: "Account not found" });
      }

      const isPasswordValid = await bcrypt.compare(
        oldPassword,
        account.password
      );
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password" });
      }

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

  registerStudent: async (req, res) => {
    try {
      const {
        student_id,
        full_name,
        email,
        phone,
        gender,
        date_of_birth,
        cccd,
        address,
        start_date,
        department,
      } = req.body;

      const existingStudent = await Student.findOne({
        $or: [{ email }, { student_id }],
      });
      if (existingStudent) {
        return res
          .status(400)
          .json({ message: "Mã số sinh viên hoặc email đã tồn tại" });
      }

      const student = new Student({
        student_id,
        full_name,
        email,
        phone,
        gender,
        date_of_birth: new Date(date_of_birth),
        cccd,
        address,
        start_date: new Date(start_date),
        department,
        isActive: false,
        score_year: 0,
        degree: "None",
        role: "student",
        avatar:
          "https://i.pinimg.com/1200x/bc/43/98/bc439871417621836a0eeea768d60944.jpg",
      });
      await student.save();

      const defaultPassword = "1111";
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(defaultPassword, salt);

      const account = new Account({
        user_id: student._id,
        user_type: "Student",
        password: hashedPassword,
      });
      await account.save();

      res.status(201).json({
        message: "Student registered successfully. Awaiting approval.",
        student,
        account: {
          user_id: account.user_id,
          user_type: account.user_type,
        },
      });
    } catch (error) {
      console.error("Error registering student:", error);
      res.status(500).json({ message: error.message });
    }
  },

  approveStudent: async (req, res) => {
    try {
      const { studentId } = req.params;

      const student = await Student.findOne({ student_id: studentId });
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      if (student.isActive) {
        return res.status(400).json({ message: "Student is already approved" });
      }

      student.isActive = true;
      await student.save();

      const account = await Account.findOne({ user_id: student._id });
      if (!account) {
        return res
          .status(404)
          .json({ message: "Account not found for this student" });
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: student.email,
        subject:
          "Hệ thống quản lý các bài báo nghiên cứu khoa học của sinh viên và giảng viên trường Đại học Công Nghiệp TPHCM",
        text: `Chào ${student.full_name},\n\nTài khỏan của bạn đã được phê duyệt thành công trên hệ thống quản lý bài báo nghiên cứu khoa học của sinh viên và giảng viên trường Đại học Công Nghiệp TPHCM.\n\nBạn có thể đăng nhập vào hệ thống bằng mã số sinh viên của bạn: ${student.student_id}\n\nHãy truy cập vào hệ thống tại địa chỉ: https://kltn-fe-alpha.vercel.app/\n\nMật khẩu mặc định là: 1111\n\nSau khi đăng nhập, bạn nên thay đổi mật khẩu của mình để bảo mật tài khoản.\n\nNếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.\n\nTrân trọng,\nHệ thống quản lý bài báo nghiên cứu khoa học`,
      };

      console.log("Sending email to:", student.email);

      await transporter.sendMail(mailOptions);

      res.status(200).json({
        message: "Sinh viên đã được phê duyệt thành công và email đã được gửi",
        student,
        account: {
          user_id: account.user_id,
          user_type: account.user_type,
        },
      });
    } catch (error) {
      console.error("Error approving student:", error);
      res
        .status(500)
        .json({ message: "An error occurred", error: error.message });
    }
  },
};

module.exports = authController;
