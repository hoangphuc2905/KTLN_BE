const Lecturer = require("../models/Lecturer");
const Student = require("../models/Student");
const Account = require("../models/Account");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Department = require("../models/Department");
const Role = require("../models/Role");
const xlsx = require("xlsx");

const lecturerController = {
  createLecturer: async (req, res) => {
    try {
      // Tạo giảng viên
      const lecturer = new Lecturer(req.body);
      await lecturer.save();

      // Tạo mật khẩu mặc định
      const defaultPassword = "1111";
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(defaultPassword, salt);

      // Tạo tài khoản cho giảng viên
      const account = new Account({
        user_id: lecturer._id,
        user_type: "Lecturer",
        password: hashedPassword,
      });
      await account.save();

      res.status(201).json({
        message: "Lecturer and account created successfully",
        lecturer,
        account: {
          user_id: account.user_id,
          user_type: account.user_type,
        },
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  importLecturersFromExcel: async (req, res) => {
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

      // Lưu danh sách giảng viên vào cơ sở dữ liệu
      const lecturers = [];
      for (const row of sheetData) {
        // Tạo giảng viên
        const lecturer = new Lecturer({
          lecturer_id: row.lecturer_id,
          full_name: row.full_name,
          email: row.email,
          phone: row.phone,
          gender: row.gender,
          date_of_birth: new Date(row.date_of_birth),
          score_year: 0,
          cccd: row.cccd,
          start_date: new Date(row.start_date),
          address: row.address,
          department: departmentId,
          roles: "67e0033fad59fbe6e1602a4c",
          avatar:
            row.avatar ||
            "https://i.pinimg.com/1200x/bc/43/98/bc439871417621836a0eeea768d60944.jpg",
          degree: row.degree || "Bachelor",
          isActive: true,
        });
        await lecturer.save();

        // Tạo mật khẩu mặc định
        const defaultPassword = "1111";
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(defaultPassword, salt);

        // Tạo tài khoản cho giảng viên
        const account = new Account({
          user_id: lecturer._id,
          user_type: "Lecturer",
          password: hashedPassword,
        });
        await account.save();

        lecturers.push({
          lecturer,
          account: {
            user_id: account.user_id,
            user_type: account.user_type,
          },
        });
      }

      res.status(201).json({
        message: "Lecturers and accounts created successfully",
        lecturers,
      });
    } catch (error) {
      console.error("Error importing lecturers:", error);
      res.status(500).json({ message: error.message });
    }
  },

  getAllLecturers: async (req, res) => {
    try {
      const lecturers = await Lecturer.find().populate("roles").populate({
        path: "department",
        select: "department_name",
      });
      res.status(200).json(lecturers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getLecturerById: async (req, res) => {
    try {
      const lecturer = await Lecturer.findOne({
        lecturer_id: req.params.lecturer_id,
      }).populate({
        path: "roles",
        select: "role_name",
      });
      if (!lecturer) {
        return res.status(404).json({ message: "Lecturer not found" });
      }
      res.status(200).json(lecturer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateLecturerById: async (req, res) => {
    try {
      const lecturer = await Lecturer.findOneAndUpdate(
        { lecturer_id: req.params.lecturer_id },
        req.body,
        { new: true, runValidators: true }
      ).populate("department roles");
      if (!lecturer) {
        return res.status(404).json({ message: "Lecturer not found" });
      }
      res.status(200).json(lecturer);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateStatusLecturerById: async (req, res) => {
    try {
      const lecturer = await Lecturer.findOneAndUpdate(
        { lecturer_id: req.params.lecturer_id },
        { isActive: req.body.isActive },
        { new: true, runValidators: true }
      ).populate("department roles");
      if (!lecturer) {
        return res.status(404).json({ message: "Lecturer not found" });
      }
      res.status(200).json(lecturer);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  assignRole: async (req, res) => {
    try {
      const { adminId, lecturerId, newRole } = req.body;

      // Kiểm tra các tham số đầu vào
      if (!adminId || !lecturerId || !newRole) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Lấy thông tin giảng viên cần gán quyền (lecturerId)
      const lecturer = await Lecturer.findOne({
        lecturer_id: lecturerId,
      }).populate({
        path: "roles",
        select: "role_name",
      });
      if (!lecturer) {
        return res.status(404).json({ message: "Lecturer not found" });
      }

      console.log("Lecturer roles:", lecturer.roles);

      // Lấy thông tin người thực hiện (adminId)
      const admin = await Lecturer.findOne({ lecturer_id: adminId }).populate({
        path: "roles",
        select: "role_name", // Chỉ lấy trường role_name
      });
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      console.log("Admin roles:", admin.roles);

      // Kiểm tra quyền admin
      if (admin.roles.some((role) => role.role_name === "admin")) {
        console.log("Admin has full permission to assign roles");
      } else if (
        admin.roles.some((role) => role.role_name === "head_of_department")
      ) {
        if (admin.department.toString() !== lecturer.department.toString()) {
          return res.status(403).json({
            message: "You can only change roles within your department",
          });
        }
      } else if (
        admin.roles.some(
          (role) => role.role_name === "deputy_head_of_department"
        )
      ) {
        if (admin.department.toString() !== lecturer.department.toString()) {
          return res.status(403).json({
            message: "You can only change roles within your department",
          });
        }
        if (
          lecturer.roles.some((role) => role.role_name === "head_of_department")
        ) {
          return res.status(403).json({
            message: "You cannot change the role of the head of department",
          });
        }
      } else if (
        admin.roles.some((role) => role.role_name === "department_in_charge")
      ) {
        if (admin.department.toString() !== lecturer.department.toString()) {
          return res.status(403).json({
            message: "You can only change roles within your department",
          });
        }
        if (
          lecturer.roles.some(
            (role) =>
              role.role_name === "head_of_department" ||
              role.role_name === "deputy_head_of_department"
          )
        ) {
          return res.status(403).json({
            message:
              "You cannot change the role of the head of department or deputy head of department",
          });
        }
      } else {
        return res
          .status(403)
          .json({ message: "You do not have permission to assign roles" });
      }

      // Lấy `_id` của vai trò mới từ collection `roles`
      const role = await Role.findOne({ role_name: newRole });
      if (!role) {
        return res.status(400).json({ message: "Invalid role" });
      }

      console.log("New role ID:", role._id);

      // Kiểm tra số lượng vai trò trong khoa
      const department = await Department.findById(
        lecturer.department
      ).populate({
        path: "roles",
        select: "role_name",
      });
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }

      // Kiểm tra nếu vai trò đã đạt giới hạn
      if (newRole === "head_of_department") {
        const headCount = await Lecturer.countDocuments({
          department: lecturer.department,
          roles: role._id,
        });
        if (headCount >= 1) {
          return res.status(400).json({
            message: "There can only be one head of department in a department",
          });
        }
      } else if (newRole === "deputy_head_of_department") {
        const deputyCount = await Lecturer.countDocuments({
          department: lecturer.department,
          roles: role._id,
        });
        if (deputyCount >= 1) {
          return res.status(400).json({
            message:
              "There can only be one deputy head of department in a department",
          });
        }
      } else if (newRole === "department_in_charge") {
        const inChargeCount = await Lecturer.countDocuments({
          department: lecturer.department,
          roles: role._id,
        });
        if (inChargeCount >= 3) {
          return res.status(400).json({
            message:
              "There can only be up to three department in charge in a department",
          });
        }
      }

      // Lấy `_id` của vai trò "lecturer" từ collection `roles`
      const lecturerRole = await Role.findOne({ role_name: "lecturer" });
      if (!lecturerRole) {
        return res
          .status(500)
          .json({ message: "Default lecturer role not found" });
      }

      // Đảm bảo quyền "lecturer" luôn tồn tại và không bị trùng lặp
      const roleIds = lecturer.roles.map((r) => r._id.toString());
      if (!roleIds.includes(lecturerRole._id.toString())) {
        lecturer.roles.push(lecturerRole._id);
      }

      // Thêm vai trò mới nếu chưa tồn tại
      if (!roleIds.includes(role._id.toString())) {
        lecturer.roles.push(role._id);
      }

      // Loại bỏ các vai trò trùng lặp
      lecturer.roles = [...new Set(lecturer.roles.map((r) => r.toString()))];

      await lecturer.save();

      // Cập nhật vai trò cho khoa
      if (!department.roles.includes(role._id)) {
        department.roles.push(role._id); // Thêm vai trò vào danh sách roles của khoa
        await department.save();
        console.log(
          `Role ${newRole} added to department ${department.department_name}`
        );
      }

      res.status(200).json({
        message: `Role ${newRole} assigned to lecturer ${lecturer.full_name} and updated in department ${department.department_name}`,
      });
    } catch (error) {
      console.error("Error in assignRole:", error);
      res.status(500).json({ message: error.message });
    }
  },

  deleteRole: async (req, res) => {
    try {
      const { adminId, lecturerId, role } = req.body;

      console.log("Request body:", req.body);

      // Kiểm tra các tham số đầu vào
      if (!adminId || !lecturerId || !role) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Lấy thông tin người thực hiện (adminId)
      const admin = await Lecturer.findOne({ lecturer_id: adminId }).populate({
        path: "roles",
        select: "role_name", // Chỉ lấy trường role_name
      });
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      console.log("Admin roles:", admin.roles);

      // Lấy thông tin giảng viên cần xóa vai trò (lecturerId)
      const lecturer = await Lecturer.findOne({
        lecturer_id: lecturerId,
      }).populate({
        path: "roles",
        select: "role_name",
      });
      if (!lecturer) {
        return res.status(404).json({ message: "Lecturer not found" });
      }

      console.log("Lecturer roles before removal:", lecturer.roles);
      console.log("Role ID to remove:", role);

      // Chuyển roleId thành ObjectId
      const roleObjectId = new mongoose.Types.ObjectId(role);

      // Kiểm tra xem vai trò có tồn tại trong danh sách vai trò của giảng viên không
      const roleIndex = lecturer.roles.findIndex(
        (role) => role._id.toString() === roleObjectId.toString()
      );
      if (roleIndex === -1) {
        return res
          .status(400)
          .json({ message: "Role not assigned to lecturer" });
      }

      // Xóa vai trò khỏi danh sách
      lecturer.roles.splice(roleIndex, 1);
      await lecturer.save();

      console.log("Lecturer roles after removal:", lecturer.roles);

      res.status(200).json({
        message: `Role removed successfully from lecturer ${lecturer.full_name}`,
      });
    } catch (error) {
      console.error("Error in deleteRole:", error);
      res.status(500).json({ message: error.message });
    }
  },

  updateRoleLecturerById: async (req, res) => {
    try {
      const lecturer = await Lecturer.findOneAndUpdate(
        { lecturer_id: req.params.lecturer_id },
        { roles: req.body.roles },
        { new: true, runValidators: true }
      ).populate("department roles");
      if (!lecturer) {
        return res.status(404).json({ message: "Lecturer not found" });
      }
      res.status(200).json(lecturer);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getLecturerAndStudentByDepartment: async (req, res) => {
    try {
      const departmentId = req.params.department_id;

      if (!mongoose.Types.ObjectId.isValid(departmentId)) {
        return res.status(400).json({ message: "Invalid department ID" });
      }

      const lecturers = await Lecturer.find({ department: departmentId })
        .select(
          "lecturer_id full_name email phone gender date_of_birth department roles score_year avatar degree isActive cccd start_date address"
        )
        .populate("department", "department_name")
        .populate("roles", "role_name");

      const students = await Student.find({ department: departmentId })
        .select(
          "student_id full_name email phone gender date_of_birth department score_year avatar role degree isActive cccd start_date address"
        )
        .populate("department", "department_name");

      res.status(200).json({
        lecturers,
        students,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteLecturerById: async (req, res) => {
    try {
      const lecturer = await Lecturer.findOneAndDelete({
        lecturer_id: req.params.lecturer_id,
      });
      if (!lecturer) {
        return res.status(404).json({ message: "Lecturer not found" });
      }

      await Account.findOneAndDelete({ user_id: lecturer._id });

      res
        .status(200)
        .json({ message: "Lecturer and account deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = lecturerController;
