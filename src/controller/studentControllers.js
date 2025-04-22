const Student = require("../models/Student");
const Account = require("../models/Account");
const bcrypt = require("bcryptjs");
const xlsx = require("xlsx");

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
        password: hashedPassword,
      });
      await account.save();

      res.status(201).json({
        message: "Student and account created successfully",
        student,
        account: {
          user_id: account.user_id,
          user_type: account.user_type,
        },
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

 
  getInactiveStudentsByDepartment: async (req, res) => {
    try {
      const { departmentId } = req.params; // Lấy departmentId từ URL params

      // Tìm tất cả sinh viên có trạng thái isActive: false và thuộc khoa được chỉ định
      const inactiveStudents = await Student.find({
        department: departmentId,
        isActive: false,
      }).populate({
        path: "department",
        select: "department_name",
      });

      // Kiểm tra nếu không có sinh viên nào
      if (!inactiveStudents || inactiveStudents.length === 0) {
        return res.status(404).json({
          message: "No inactive students found for this department",
        });
      }

      // Trả về danh sách sinh viên
      res.status(200).json({
        message: "Inactive students retrieved successfully",
        students: inactiveStudents,
      });
    } catch (error) {
      console.error("Error retrieving inactive students:", error);
      res.status(500).json({
        message: "An error occurred while retrieving inactive students",
        error: error.message,
      });
    }
  },

  importStudentsFromExcel: async (req, res) => {
    try {
      // Kiểm tra xem file có được tải lên không
      if (!req.file || !req.file.path) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Lấy department từ người đăng nhập
      const departmentId = req.user?.department; // Giả sử `req.user` chứa thông tin người dùng đăng nhập
      if (!departmentId) {
        return res
          .status(403)
          .json({ message: "Unauthorized: No department found for the user" });
      }

      // Đọc file Excel
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0]; // Lấy sheet đầu tiên
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Kiểm tra dữ liệu trong file Excel
      if (!sheetData || sheetData.length === 0) {
        return res.status(400).json({ message: "File is empty or invalid" });
      }

      // Lưu danh sách sinh viên vào cơ sở dữ liệu
      const students = [];
      for (const row of sheetData) {
        // Tạo sinh viên
        const student = new Student({
          student_id: row.student_id,
          full_name: row.full_name,
          email: row.email,
          phone: row.phone,
          gender: row.gender,
          date_of_birth: new Date(row.date_of_birth),
          cccd: row.cccd,
          address: row.address,
          start_date: new Date(row.start_date),
          department: departmentId, // Lấy department từ người đăng nhập
          score_year: 0,
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

        students.push({
          student,
          account: {
            user_id: account.user_id,
            user_type: account.user_type,
          },
        });
      }

      res.status(201).json({
        message: "Students and accounts created successfully",
        students,
      });
    } catch (error) {
      console.error("Error importing students:", error);
      res.status(500).json({ message: error.message });
    }
  },

  getAllStudents: async (req, res) => {
    try {
      const students = await Student.find().populate({
        path: "department",
        select: "department_name",
      });

      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getStudentById: async (req, res) => {
    try {
      const student = await Student.findOne({
        student_id: req.params.student_id,
      });
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.status(200).json(student);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateStudentById: async (req, res) => {
    try {
      const student = await Student.findOneAndUpdate(
        { student_id: req.params.student_id },
        req.body,
        { new: true, runValidators: true }
      );
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.status(200).json(student);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateStatusStudentById: async (req, res) => {
    try {
      const student = await Student.findOneAndUpdate(
        { student_id: req.params.student_id },
        { isActive: req.body.isActive },
        { new: true, runValidators: true }
      );
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.status(200).json(student);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteStudentById: async (req, res) => {
    try {
      const student = await Student.findOneAndDelete({
        student_id: req.params.student_id,
      });
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      // Xóa tài khoản liên quan đến sinh viên
      await Account.findOneAndDelete({ user_id: student._id });

      res
        .status(200)
        .json({ message: "Student and account deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = studentController;
