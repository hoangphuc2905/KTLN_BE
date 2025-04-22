const Student = require("../models/Student");
const Lecturer = require("../models/Lecturer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Account = require("../models/Account");
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
        return res.status(400).json({ message: "Mât khẩu không đúng" });
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

  registerStudent: async (req, res) => {
    try {
      // Lấy thông tin từ body
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

      // Tạo mật khẩu mặc định
      const defaultPassword = "1111";
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(defaultPassword, salt);

      // Tạo tài khoản cho sinh viên
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

      // Tìm sinh viên theo ID
      const student = await Student.findOne({ student_id: studentId });
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      // Kiểm tra nếu sinh viên đã được duyệt
      if (student.isActive) {
        return res.status(400).json({ message: "Student is already approved" });
      }

      // Cập nhật trạng thái isActive thành true
      student.isActive = true;
      await student.save();

      // Lấy tài khoản đã tạo khi đăng ký
      const account = await Account.findOne({ user_id: student._id });
      if (!account) {
        return res
          .status(404)
          .json({ message: "Account not found for this student" });
      }

      // Cấu hình transporter của nodemailer
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER, // Email của bạn
          pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng
        },
      });

      // Nội dung email
      const mailOptions = {
        from: process.env.EMAIL_USER, // Email người gửi
        to: student.email, // Email người nhận
        subject:
          "Hệ thống quản lý các bài báo nghiên cứu khoa học của sinh viên và giảng viên trường Đại học Công Nghiệp TPHCM",
        text: `Chào ${student.full_name},\n\nTài khỏan của bạn đã được phê duyệt thành công trên hệ thống quản lý bài báo nghiên cứu khoa học của sinh viên và giảng viên trường Đại học Công Nghiệp TPHCM.\n\nBạn có thể đăng nhập vào hệ thống bằng mã số sinh viên của bạn: ${student.student_id}\n\nMật khẩu mặc định là: 1111\n\nSau khi đăng nhập, bạn nên thay đổi mật khẩu của mình để bảo mật tài khoản.\n\nNếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.\n\nTrân trọng,\nHệ thống quản lý bài báo nghiên cứu khoa học`,
      };

      console.log("Sending email to:", student.email);

      // Gửi email
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
