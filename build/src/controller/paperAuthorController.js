const PaperAuthor = require("../models/PaperAuthor");
const Lecturer = require("../models/Lecturer");
const Student = require("../models/Student");
const Department = require("../models/Department");
const {
  getAcademicYearRange,
  getDefaultAcademicYear
} = require("../utils/dateUtils");
const paperAuthorController = {
  createPaperAuthor: async (req, res) => {
    try {
      const {
        paper_id,
        user_id,
        author_name_vi,
        author_name_en,
        role,
        point,
        work_unit_id,
        degree
      } = req.body;

      // Validate degree if provided
      const validDegrees = ["Bachelor", "Master", "Doctor", "Egineer", "Professor", "Ossociate_Professor"];
      if (degree && !validDegrees.includes(degree)) {
        return res.status(400).json({
          message: "Invalid degree value"
        });
      }
      const paperAuthor = new PaperAuthor({
        paper_id,
        user_id,
        author_name_vi,
        author_name_en,
        role,
        point,
        work_unit_id,
        degree
      });
      await paperAuthor.save();
      res.status(201).json(paperAuthor);
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  },
  getAllPaperAuthors: async (req, res) => {
    try {
      const paperAuthors = await PaperAuthor.find().populate("paper_id").populate("work_unit_id"); // Removed .populate("user_id")
      res.status(200).json(paperAuthors);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
  getPaperAuthorById: async (req, res) => {
    try {
      const {
        id
      } = req.params;

      // Tìm kiếm dựa trên user_id thay vì _id
      const paperAuthor = await PaperAuthor.findOne({
        user_id: id
      }).populate("paper_id").populate("work_unit_id");
      if (!paperAuthor) {
        return res.status(404).json({
          message: "Paper author not found"
        });
      }
      res.status(200).json(paperAuthor);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
  getAuthorsByPaperId: async (req, res) => {
    try {
      const {
        paper_id
      } = req.params;
      const authors = await PaperAuthor.find({
        paper_id
      }).populate("work_unit_id"); // Removed .populate("user_id")
      if (!authors || authors.length === 0) {
        return res.status(404).json({
          message: "No authors found for this paper"
        });
      }
      res.status(200).json(authors);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
  updatePaperAuthorById: async (req, res) => {
    try {
      const {
        paper_id,
        user_id,
        author_name_vi,
        author_name_en,
        role,
        point,
        work_unit_id,
        degree
      } = req.body;

      // Validate degree if provided
      const validDegrees = ["Bachelor", "Master", "Doctor", "Egineer", "Professor", "Ossociate_Professor"];
      if (degree && !validDegrees.includes(degree)) {
        return res.status(400).json({
          message: "Invalid degree value"
        });
      }
      const paperAuthor = await PaperAuthor.findByIdAndUpdate(req.params.id, {
        paper_id,
        user_id,
        author_name_vi,
        author_name_en,
        role,
        point,
        work_unit_id,
        degree
      }, {
        new: true,
        runValidators: true
      }).populate("paper_id").populate("user_id").populate("work_unit_id");
      if (!paperAuthor) {
        return res.status(404).json({
          message: "PaperAuthor not found"
        });
      }
      res.status(200).json(paperAuthor);
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  },
  getAllPaperAuthorsByTolalPointsAndTotalPapers: async (req, res) => {
    try {
      const {
        academicYear
      } = req.query; // Lấy `academicYear` từ query string

      // Nếu có năm học, tính khoảng thời gian
      let dateFilter = {};
      if (academicYear) {
        const {
          startDate,
          endDate
        } = getAcademicYearRange(academicYear);
        dateFilter = {
          "paperInfo.createdAt": {
            $gte: startDate,
            $lte: endDate
          }
        };
      }
      const result = await PaperAuthor.aggregate([
      // 1. Join vào bảng lecturers
      {
        $lookup: {
          from: "lecturers",
          localField: "user_id",
          foreignField: "lecturer_id",
          as: "lecturerInfo"
        }
      },
      // 2. Join vào bảng students
      {
        $lookup: {
          from: "students",
          localField: "user_id",
          foreignField: "student_id",
          as: "studentInfo"
        }
      },
      // 3. Lấy department từ lecturer hoặc student
      {
        $addFields: {
          department_id: {
            $ifNull: [{
              $arrayElemAt: ["$lecturerInfo.department", 0]
            }, {
              $arrayElemAt: ["$studentInfo.department", 0]
            }]
          }
        }
      },
      // 4. Join vào bảng scientificpapers để lấy thông tin bài báo
      {
        $lookup: {
          from: "scientificpapers",
          localField: "paper_id",
          foreignField: "_id",
          as: "paperInfo"
        }
      },
      // 5. Lọc chỉ những bài đã được duyệt và theo năm học (nếu có)
      {
        $match: {
          "paperInfo.status": "approved",
          ...dateFilter // Áp dụng bộ lọc theo năm học (nếu có)
        }
      },
      // 6. Nhóm theo department_id, dùng $addToSet để tránh đếm trùng paper
      {
        $group: {
          _id: "$department_id",
          unique_paper_ids: {
            $addToSet: "$paper_id"
          },
          total_points: {
            $sum: "$point"
          }
        }
      },
      // 7. Tính tổng số bài (sau khi loại trùng)
      {
        $addFields: {
          total_papers: {
            $size: "$unique_paper_ids"
          }
        }
      },
      // 8. Join vào bảng departments để lấy tên khoa
      {
        $lookup: {
          from: "departments",
          localField: "_id",
          foreignField: "_id",
          as: "departmentInfo"
        }
      }, {
        $unwind: "$departmentInfo"
      },
      // 9. Format kết quả trả về
      {
        $project: {
          _id: 0,
          DEPARTMENT_ID: "$_id",
          KHOA: "$departmentInfo.department_name",
          TỔNG_BÀI: "$total_papers",
          TỔNG_ĐIỂM: "$total_points"
        }
      }, {
        $sort: {
          TỔNG_BÀI: -1
        } // Sắp xếp theo số bài giảm dần
      }]);
      res.status(200).json({
        message: academicYear ? `Statistics for academic year ${academicYear}` : "Statistics for all academic years",
        academicYear: academicYear || "All",
        result
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        message: error.message
      });
    }
  },
  getPaperAuthorsByDepartment: async (req, res) => {
    try {
      const {
        department_id
      } = req.params; // Lấy department_id từ URL
      const {
        academicYear
      } = req.query; // Lấy `academicYear` từ query string

      // Tìm thông tin khoa
      const department = await Department.findById(department_id).select("department_name");
      if (!department) {
        return res.status(404).json({
          message: "Department not found"
        });
      }

      // Tìm tất cả giảng viên và sinh viên thuộc khoa đó
      const lecturers = await Lecturer.find({
        department: department_id
      }).select("lecturer_id");
      const students = await Student.find({
        department: department_id
      }).select("student_id");

      // Lấy danh sách user_id từ giảng viên và sinh viên
      const userIds = [...lecturers.map(lecturer => lecturer.lecturer_id), ...students.map(student => student.student_id)];
      if (userIds.length === 0) {
        return res.status(404).json({
          message: "No authors found for this department"
        });
      }

      // Nếu có năm học, tính khoảng thời gian
      let dateFilter = {};
      if (academicYear) {
        const {
          startDate,
          endDate
        } = getAcademicYearRange(academicYear);
        dateFilter = {
          "paperInfo.createdAt": {
            $gte: startDate,
            $lte: endDate
          }
        };
      }

      // Lấy danh sách tác giả thuộc khoa với bài viết đã được duyệt
      const paperAuthors = await PaperAuthor.aggregate([{
        $match: {
          user_id: {
            $in: userIds
          } // Lọc theo danh sách user_id
        }
      }, {
        $lookup: {
          from: "scientificpapers",
          // Join với bảng scientificpapers
          localField: "paper_id",
          foreignField: "_id",
          as: "paperInfo"
        }
      }, {
        $match: {
          "paperInfo.status": "approved",
          // Chỉ lấy bài viết đã được duyệt
          ...dateFilter // Áp dụng bộ lọc theo năm học (nếu có)
        }
      }, {
        $group: {
          _id: "$user_id",
          author_name_vi: {
            $first: "$author_name_vi"
          },
          author_name_en: {
            $first: "$author_name_en"
          },
          role: {
            $first: "$role"
          },
          total_papers: {
            $sum: 1
          },
          total_points: {
            $sum: "$point"
          }
        }
      }, {
        $sort: {
          total_points: -1
        }
      }]);
      if (!paperAuthors || paperAuthors.length === 0) {
        return res.status(404).json({
          message: "No authors found for this department"
        });
      }
      const result = paperAuthors.map(author => ({
        MÃ_TÁC_GIẢ: author._id,
        TÁC_GIẢ: author.author_name_vi || author.author_name_en || "N/A",
        KHOA: department.department_name || "N/A",
        TỔNG_BÀI: author.total_papers,
        TỔNG_ĐIỂM: author.total_points
      }));
      res.status(200).json({
        message: academicYear ? `Authors in department ${department.department_name} for academic year ${academicYear}` : `Authors in department ${department.department_name}`,
        academicYear: academicYear || "All",
        result
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        message: error.message
      });
    }
  },
  getTotalPointsByAuthorAndYear: async (req, res) => {
    try {
      const {
        user_id
      } = req.params;
      const {
        academicYear
      } = req.query;
      let dateFilter = {};
      if (academicYear) {
        const {
          startDate,
          endDate
        } = getAcademicYearRange(academicYear);
        dateFilter = {
          "paperInfo.createdAt": {
            $gte: startDate,
            $lte: endDate
          }
        };
      }
      const result = await PaperAuthor.aggregate([{
        $match: {
          user_id
        }
      }, {
        $lookup: {
          from: "scientificpapers",
          localField: "paper_id",
          foreignField: "_id",
          as: "paperInfo"
        }
      }, {
        $match: {
          "paperInfo.status": "approved",
          ...dateFilter
        }
      }, {
        $group: {
          _id: "$user_id",
          total_points: {
            $sum: "$point"
          }
        }
      }]);
      if (!result || result.length === 0) {
        return res.status(200).json({
          message: "Không có điểm nào cho tác giả này"
        });
      }
      res.status(200).json({
        message: academicYear ? `Total points for author ${user_id} in academic year ${academicYear}` : `Total points for author ${user_id} across all years`,
        academicYear: academicYear || "All",
        total_points: result[0].total_points
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        message: error.message
      });
    }
  },
  deletePaperAuthorById: async (req, res) => {
    try {
      const {
        id
      } = req.params;
      const result = await PaperAuthor.findByIdAndDelete(id); // Use findByIdAndDelete for consistency
      if (!result) {
        return res.status(404).json({
          message: "Paper author not found"
        });
      }
      res.status(200).json({
        message: "Paper author deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error
      });
    }
  }
};
module.exports = paperAuthorController;