const ScientificPaper = require("../models/ScientificPaper");
const PaperView = require("../models/PaperViews");
const PaperDownload = require("../models/PaperDownloads");
const PaperAuthor = require("../models/PaperAuthor");
const Lecturer = require("../models/Lecturer");
const Student = require("../models/Student");

const statisticsController = {
  getTotalPapersByAuthorId: async (req, res) => {
    try {
      const { author_id } = req.params;

      const result = await ScientificPaper.aggregate([
        {
          $lookup: {
            from: "paperauthors",
            localField: "author",
            foreignField: "_id",
            as: "authorDetails",
          },
        },
        {
          $match: {
            "authorDetails.user_id": author_id.toString(),
            status: "approved",
          },
        },
        {
          $count: "totalPapers",
        },
      ]);

      const totalPapers = result.length > 0 ? result[0].totalPapers : 0;

      res.status(200).json({
        author_id,
        total_papers: totalPapers,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getTotalViewsByAuthorId: async (req, res) => {
    try {
      const { author_id } = req.params;

      const result = await ScientificPaper.aggregate([
        {
          $lookup: {
            from: "paperviews",
            localField: "_id",
            foreignField: "paper_id",
            as: "viewDetails",
          },
        },
        {
          $lookup: {
            from: "paperauthors",
            localField: "author",
            foreignField: "_id",
            as: "authorDetails",
          },
        },
        {
          $match: {
            "authorDetails.user_id": author_id.toString(),
            status: "approved",
          },
        },
        {
          $unwind: "$viewDetails",
        },
        {
          $group: {
            _id: null,
            totalViews: { $sum: 1 },
          },
        },
      ]);

      const totalViews = result.length > 0 ? result[0].totalViews : 0;

      res.status(200).json({
        author_id,
        total_views: totalViews,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getTotalDownloadsByAuthorId: async (req, res) => {
    try {
      const { author_id } = req.params;

      const result = await ScientificPaper.aggregate([
        {
          $lookup: {
            from: "paperdownloads",
            localField: "_id",
            foreignField: "paper_id",
            as: "downloadDetails",
          },
        },
        {
          $lookup: {
            from: "paperauthors",
            localField: "author",
            foreignField: "_id",
            as: "authorDetails",
          },
        },
        {
          $match: {
            "authorDetails.user_id": author_id.toString(),
            status: "approved",
          },
        },
        {
          $unwind: "$downloadDetails",
        },
        {
          $group: {
            _id: null,
            totalDownloads: { $sum: 1 },
          },
        },
      ]);

      const totalDownloads = result.length > 0 ? result[0].totalDownloads : 0;

      res.status(200).json({
        author_id,
        total_downloads: totalDownloads,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getTotalPointByAuthorId: async (req, res) => {
    try {
      const { author_id } = req.params;

      const result = await ScientificPaper.aggregate([
        {
          $lookup: {
            from: "paperauthors",
            localField: "author",
            foreignField: "_id",
            as: "authorDetails",
          },
        },
        {
          $match: {
            "authorDetails.user_id": author_id.toString(),
            status: "approved",
          },
        },
        {
          $addFields: {
            authorDetails: {
              $filter: {
                input: "$authorDetails",
                as: "author",
                cond: { $eq: ["$$author.user_id", author_id.toString()] },
              },
            },
          },
        },
        {
          $unwind: "$authorDetails",
        },
        {
          $group: {
            _id: null,
            totalPoints: { $sum: "$authorDetails.point" },
          },
        },
      ]);

      const totalPoints = result.length > 0 ? result[0].totalPoints : 0;

      // Trả về kết quả
      res.status(200).json({
        author_id,
        total_points: totalPoints,
      });
    } catch (error) {
      console.error("Error in getTotalContributionByAuthorId:", error.message);
      res.status(500).json({
        message: "An error occurred while retrieving the total points",
        error: error.message,
      });
    }
  },

  getTop3PapersByAuthorId: async (req, res) => {
    try {
      const { author_id } = req.params;

      const result = await ScientificPaper.aggregate([
        {
          $lookup: {
            from: "paperviews",
            localField: "_id",
            foreignField: "paper_id",
            as: "viewDetails",
          },
        },
        {
          $lookup: {
            from: "paperdownloads",
            localField: "_id",
            foreignField: "paper_id",
            as: "downloadDetails",
          },
        },
        {
          $lookup: {
            from: "paperauthors",
            localField: "author",
            foreignField: "_id",
            as: "authorDetails",
          },
        },
        {
          $match: {
            "authorDetails.user_id": author_id.toString(),
            status: "approved",
          },
        },
        {
          $addFields: {
            viewCount: { $size: "$viewDetails" },
            downloadCount: { $size: "$downloadDetails" },
            authorDetails: {
              $filter: {
                input: "$authorDetails", // Lọc danh sách tác giả
                as: "author",
                cond: { $eq: ["$$author.user_id", author_id.toString()] }, // Chỉ giữ tác giả có `user_id` khớp
              },
            },
            contributionScore: {
              $arrayElemAt: ["$authorDetails.point", 0], // Chỉ lấy điểm đóng góp của tác giả
            },
          },
        },
        {
          $sort: { contributionScore: -1 }, // Sắp xếp theo điểm đóng góp giảm dần
        },
        {
          $limit: 3, // Lấy top 3 bài
        },
        {
          $project: {
            paper_id: 1,
            title_vn: 1,
            title_en: 1,
            viewCount: 1,
            downloadCount: 1,
            contributionScore: 1,
            authorDetails: {
              author_name_vi: 1,
              author_name_en: 1,
              role: 1,
              point: 1,
            },
          },
        },
      ]);

      // Kiểm tra nếu không có bài nghiên cứu nào
      if (!result || result.length === 0) {
        return res.status(404).json({
          message: "No papers found for this author",
        });
      }

      // Trả về kết quả
      res.status(200).json({
        message: "Top 3 papers by author retrieved successfully",
        papers: result,
      });
    } catch (error) {
      console.error("Error in getTop3PapersByAuthor:", error.message);
      res.status(500).json({
        message:
          "An error occurred while retrieving the top 3 papers by author",
        error: error.message,
      });
    }
  },

  getStatisticsByDepartmentId: async (req, res) => {
    try {
      const { department_id } = req.params;

      // 1. Lấy tất cả student_id và lecturer_id thuộc khoa
      const students = await Student.find({ department: department_id }).select(
        "student_id"
      );
      const lecturers = await Lecturer.find({
        department: department_id,
      }).select("lecturer_id");

      const userIds = [
        ...students.map((s) => s.student_id.toString()),
        ...lecturers.map((l) => l.lecturer_id.toString()),
      ];

      if (userIds.length === 0) {
        return res.status(200).json({
          department_id,
          total_papers: 0,
          total_views: 0,
          total_downloads: 0,
        });
      }

      // 2. Lấy tất cả paper_id của người dùng trong khoa từ bảng papers_users
      const paperAuthors = await PaperAuthor.find({
        user_id: { $in: userIds },
      }).select("paper_id");

      const paperIds = [
        ...new Set(paperAuthors.map((p) => p.paper_id.toString())),
      ]; // loại bỏ trùng

      if (paperIds.length === 0) {
        return res.status(200).json({
          department_id,
          total_papers: 0,
          total_views: 0,
          total_downloads: 0,
        });
      }

      // 3. Đếm số lượng paper đã được duyệt (status = "approved")
      const approvedPapers = await ScientificPaper.find({
        _id: { $in: paperIds },
        status: "approved",
      }).select("_id");

      const approvedPaperIds = approvedPapers.map((p) => p._id.toString());

      // 4. Đếm lượt xem
      const totalViews = await PaperView.countDocuments({
        paper_id: { $in: approvedPaperIds },
      });

      // 5. Đếm lượt tải
      const totalDownloads = await PaperDownload.countDocuments({
        paper_id: { $in: approvedPaperIds },
      });

      // 6. Trả kết quả
      res.status(200).json({
        department_id,
        total_papers: approvedPaperIds.length,
        total_views: totalViews,
        total_downloads: totalDownloads,
      });
    } catch (error) {
      console.error("Error in getStatisticsByDepartmentId:", error.message);
      res.status(500).json({ message: error.message });
    }
  },

  getStatisticsForAll: async (req, res) => {
    try {
      // 1. Lấy tất cả student_id và lecturer_id
      const students = await Student.find().select("student_id");
      const lecturers = await Lecturer.find().select("lecturer_id");

      const userIds = [
        ...students.map((s) => s.student_id.toString()),
        ...lecturers.map((l) => l.lecturer_id.toString()),
      ];

      if (userIds.length === 0) {
        return res.status(200).json({
          total_papers: 0,
          total_views: 0,
          total_downloads: 0,
        });
      }

      // 2. Lấy tất cả paper_id của người dùng từ bảng papers_users
      const paperAuthors = await PaperAuthor.find({
        user_id: { $in: userIds },
      }).select("paper_id");

      const paperIds = [
        ...new Set(paperAuthors.map((p) => p.paper_id.toString())),
      ]; // loại bỏ trùng

      if (paperIds.length === 0) {
        return res.status(200).json({
          total_papers: 0,
          total_views: 0,
          total_downloads: 0,
        });
      }

      // 3. Đếm số lượng paper đã được duyệt (status = "approved")
      const approvedPapers = await ScientificPaper.find({
        _id: { $in: paperIds },
        status: "approved",
      }).select("_id");

      const approvedPaperIds = approvedPapers.map((p) => p._id.toString());

      // 4. Đếm lượt xem
      const totalViews = await PaperView.countDocuments({
        paper_id: { $in: approvedPaperIds },
      });

      // 5. Đếm lượt tải
      const totalDownloads = await PaperDownload.countDocuments({
        paper_id: { $in: approvedPaperIds },
      });

      // 6. Trả kết quả
      res.status(200).json({
        total_papers: approvedPaperIds.length,
        total_views: totalViews,
        total_downloads: totalDownloads,
      });
    } catch (error) {
      console.error("Error in getStatisticsForAll:", error.message);
      res.status(500).json({ message: error.message });
    }
  },

  getTotalPointsByDepartmentId: async (req, res) => {
    try {
      const { department_id } = req.params;

      const result = await ScientificPaper.aggregate([
        {
          $lookup: {
            from: "paperauthors",
            localField: "author",
            foreignField: "_id",
            as: "authorDetails",
          },
        },
        {
          $lookup: {
            from: "departments",
            localField: "authorDetails.department_id",
            foreignField: "_id",
            as: "departmentDetails",
          },
        },
        {
          $match: {
            "departmentDetails._id": department_id,
            status: "approved",
          },
        },
        {
          $unwind: "$authorDetails",
        },
        {
          $group: {
            _id: null,
            totalPoints: { $sum: "$authorDetails.point" },
          },
        },
      ]);

      const totalPoints = result.length > 0 ? result[0].totalPoints : 0;

      res.status(200).json({
        department_id,
        total_points: totalPoints,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getTop3MostViewedAndDownloadedPapers: async (req, res) => {
    try {
      const topPapers = await ScientificPaper.aggregate([
        {
          $lookup: {
            from: "paperviews",
            localField: "_id",
            foreignField: "paper_id",
            as: "views",
          },
        },
        {
          $lookup: {
            from: "paperdownloads", // Tên collection chứa lượt tải xuống
            localField: "_id",
            foreignField: "paper_id",
            as: "downloads",
          },
        },
        {
          $lookup: {
            from: "paperauthors", // Tên collection chứa tác giả
            localField: "author",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $addFields: {
            viewCount: { $size: "$views" }, // Đếm số lượt xem
            downloadCount: { $size: "$downloads" }, // Đếm số lượt tải xuống
          },
        },
        {
          $sort: { viewCount: -1, downloadCount: -1 }, // Sắp xếp theo lượt xem và tải xuống giảm dần
        },
        {
          $limit: 3, // Giới hạn 5 bài
        },
        {
          $project: {
            paper_id: 1,
            title_vn: 1,
            title_en: 1,
            cover_image: 1,
            department: 1,
            viewCount: 1,
            downloadCount: 1,
            author: {
              author_name_vi: 1,
              author_name_en: 1,
              role: 1,
            },
          },
        },
      ]);

      // Kiểm tra nếu không có bài nghiên cứu nào
      if (!topPapers || topPapers.length === 0) {
        return res.status(404).json({
          message: "No scientific papers found",
        });
      }

      // Trả về kết quả
      res.status(200).json({
        message:
          "Top 3 most viewed and downloaded scientific papers retrieved successfully",
        papers: topPapers,
      });
    } catch (error) {
      console.error(
        "Error in getTop3MostViewedAndDownloadedPapers:",
        error.message
      );
      res.status(500).json({
        message:
          "An error occurred while retrieving the top 3 most viewed and downloaded scientific papers",
        error: error.message,
      });
    }
  },

  getTop3MostViewedAndDownloadedPapersByDepartment: async (req, res) => {
    try {
      const { department_id } = req.params;

      const topPapers = await ScientificPaper.aggregate([
        {
          $lookup: {
            from: "paperviews",
            localField: "_id",
            foreignField: "paper_id",
            as: "views",
          },
        },
        {
          $lookup: {
            from: "paperdownloads", // Tên collection chứa lượt tải xuống
            localField: "_id",
            foreignField: "paper_id",
            as: "downloads",
          },
        },
        {
          $lookup: {
            from: "paperauthors", // Tên collection chứa tác giả
            localField: "author",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $match: {
            department: department_id, // Lọc theo khoa
            status: "approved", // Chỉ lấy bài đã được duyệt
          },
        },
        {
          $addFields: {
            viewCount: { $size: "$views" }, // Đếm số lượt xem
            downloadCount: { $size: "$downloads" }, // Đếm số lượt tải xuống
          },
        },
        {
          $sort: { viewCount: -1, downloadCount: -1 }, // Sắp xếp theo lượt xem và tải xuống giảm dần
        },
        {
          $limit: 3, // Lấy top 3 bài
        },
        {
          $project: {
            paper_id: 1,
            title_vn: 1,
            title_en: 1,
            cover_image: 1,
            department: 1,
            viewCount: 1,
            downloadCount: 1,
            author: {
              author_name_vi: 1,
              author_name_en: 1,
              role: 1,
            },
          },
        },
      ]);

      // Kiểm tra nếu không có bài nghiên cứu nào
      if (!topPapers || topPapers.length === 0) {
        return res.status(404).json({
          message: "No scientific papers found for this department",
        });
      }

      // Trả về kết quả
      res.status(200).json({
        message:
          "Top 3 most viewed and downloaded scientific papers by department retrieved successfully",
        papers: topPapers,
      });
    } catch (error) {
      console.error(
        "Error in getTop3MostViewedAndDownloadedPapersByDepartment:",
        error.message
      );
      res.status(500).json({
        message:
          "An error occurred while retrieving the top 3 most viewed and downloaded scientific papers by department",
        error: error.message,
      });
    }
  },
};

module.exports = statisticsController;
