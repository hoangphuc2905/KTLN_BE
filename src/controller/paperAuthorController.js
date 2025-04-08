const PaperAuthor = require("../models/PaperAuthor");
const Lecturer = require("../models/Lecturer");
const Student = require("../models/Student");
const Department = require("../models/Department");

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
        degree,
      } = req.body;

      // Validate degree if provided
      const validDegrees = [
        "Bachelor",
        "Master",
        "Doctor",
        "Egineer",
        "Professor",
        "Ossociate_Professor",
      ];
      if (degree && !validDegrees.includes(degree)) {
        return res.status(400).json({ message: "Invalid degree value" });
      }

      const paperAuthor = new PaperAuthor({
        paper_id,
        user_id,
        author_name_vi,
        author_name_en,
        role,
        point,
        work_unit_id,
        degree,
      });

      await paperAuthor.save();
      res.status(201).json(paperAuthor);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getAllPaperAuthors: async (req, res) => {
    try {
      const paperAuthors = await PaperAuthor.find()
        .populate("paper_id")
        .populate("work_unit_id"); // Removed .populate("user_id")
      res.status(200).json(paperAuthors);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getPaperAuthorById: async (req, res) => {
    try {
      const { id } = req.params;

      // Tìm kiếm dựa trên user_id thay vì _id
      const paperAuthor = await PaperAuthor.findOne({ user_id: id })
        .populate("paper_id")
        .populate("work_unit_id");

      if (!paperAuthor) {
        return res.status(404).json({ message: "Paper author not found" });
      }

      res.status(200).json(paperAuthor);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAuthorsByPaperId: async (req, res) => {
    try {
      const { paper_id } = req.params;
      const authors = await PaperAuthor.find({ paper_id }).populate(
        "work_unit_id"
      ); // Removed .populate("user_id")
      if (!authors || authors.length === 0) {
        return res
          .status(404)
          .json({ message: "No authors found for this paper" });
      }
      res.status(200).json(authors);
    } catch (error) {
      res.status(500).json({ message: error.message });
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
        degree,
      } = req.body;

      // Validate degree if provided
      const validDegrees = [
        "Bachelor",
        "Master",
        "Doctor",
        "Egineer",
        "Professor",
        "Ossociate_Professor",
      ];
      if (degree && !validDegrees.includes(degree)) {
        return res.status(400).json({ message: "Invalid degree value" });
      }

      const paperAuthor = await PaperAuthor.findByIdAndUpdate(
        req.params.id,
        {
          paper_id,
          user_id,
          author_name_vi,
          author_name_en,
          role,
          point,
          work_unit_id,
          degree,
        },
        { new: true, runValidators: true }
      )
        .populate("paper_id")
        .populate("user_id")
        .populate("work_unit_id");

      if (!paperAuthor) {
        return res.status(404).json({ message: "PaperAuthor not found" });
      }
      res.status(200).json(paperAuthor);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getAllPaperAuthorsByTolalPointsAndTotalPapers: async (req, res) => {
    try {
      console.log("Route /paperauthor/summary called");

      const paperAuthors = await PaperAuthor.aggregate([
        {
          $project: {
            user_id: 1,
            author_name_vi: 1,
            author_name_en: 1,
            role: 1,
            work_unit_id: 1,
            point: 1,
          },
        },
        {
          $group: {
            _id: "$user_id",
            author_name_vi: { $first: "$author_name_vi" },
            author_name_en: { $first: "$author_name_en" },
            role: { $first: "$role" },
            work_unit_id: { $first: "$work_unit_id" },
            total_papers: { $sum: 1 },
            total_points: { $sum: "$point" },
          },
        },
        {
          $lookup: {
            from: "workunits",
            localField: "work_unit_id",
            foreignField: "_id",
            as: "work_unit",
          },
        },
        {
          $unwind: {
            path: "$work_unit",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: { total_points: -1 }, // Sắp xếp giảm dần theo điểm
        },
      ]);

      console.log("Aggregation Result:", paperAuthors);

      if (!paperAuthors || paperAuthors.length === 0) {
        console.log("Không có tác giả nào được tìm thấy.");
        return res.status(404).json({ message: "Paper author not found" });
      }

      const result = paperAuthors.map((author, index) => ({
        TÁC_GIẢ: author.author_name_vi || author.author_name_en || "N/A",
        KHOA: author.work_unit?.name_vi || "N/A",
        TỔNG_BÀI: author.total_papers,
        TỔNG_ĐIỂM: author.total_points,
      }));

      res.status(200).json(result);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: error.message });
    }
  },

  getPaperAuthorsByDepartment: async (req, res) => {
    try {
      const { department_id } = req.params; // Lấy department_id từ URL

      const department = await Department.findById(department_id).select(
        "department_name"
      );
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }
      // Tìm tất cả giảng viên và sinh viên thuộc khoa đó
      const lecturers = await Lecturer.find({
        department: department_id,
      }).select("lecturer_id");
      const students = await Student.find({ department: department_id }).select(
        "student_id"
      );

      // Lấy danh sách user_id từ giảng viên và sinh viên
      const userIds = [
        ...lecturers.map((lecturer) => lecturer.lecturer_id),
        ...students.map((student) => student.student_id),
      ];

      if (userIds.length === 0) {
        return res
          .status(404)
          .json({ message: "No authors found for this department" });
      }

      // Lấy danh sách tác giả thuộc khoa
      const paperAuthors = await PaperAuthor.aggregate([
        {
          $match: {
            user_id: { $in: userIds }, // Lọc theo danh sách user_id
          },
        },
        {
          $group: {
            _id: "$user_id",
            author_name_vi: { $first: "$author_name_vi" },
            author_name_en: { $first: "$author_name_en" },
            role: { $first: "$role" },
            total_papers: { $sum: 1 },
            total_points: { $sum: "$point" },
          },
        },
        {
          $sort: { total_points: -1 }, // Sắp xếp giảm dần theo tổng điểm
        },
      ]);

      console.log("Filtered Paper Authors by Department:", paperAuthors);

      if (!paperAuthors || paperAuthors.length === 0) {
        return res
          .status(404)
          .json({ message: "No authors found for this department" });
      }

      const result = paperAuthors.map((author, index) => ({
        TÁC_GIẢ: author.author_name_vi || author.author_name_en || "N/A",
        KHOA: department.department_name || "N/A",
        TỔNG_BÀI: author.total_papers,
        TỔNG_ĐIỂM: author.total_points,
      }));

      res.status(200).json(result);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: error.message });
    }
  },

  deletePaperAuthorById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await PaperAuthor.findByIdAndDelete(id); // Use findByIdAndDelete for consistency
      if (!result) {
        return res.status(404).json({ message: "Paper author not found" });
      }
      res.status(200).json({ message: "Paper author deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  },
};

module.exports = paperAuthorController;
