const ScientificPaper = require("../models/ScientificPaper");
const PaperView = require("../models/PaperViews");
const PaperDownload = require("../models/PaperDownloads");
const PaperAuthor = require("../models/PaperAuthor");
const Lecturer = require("../models/Lecturer");
const Student = require("../models/Student");
const PaperGroup = require("../models/PaperGroup");
const PaperType = require("../models/PaperType");
const Department = require("../models/Department");
const mongoose = require("mongoose");
const {
  getAcademicYearRange,
  getDefaultAcademicYear
} = require("../utils/dateUtils");
const statisticsController = {
  getTotalPapersByAuthorId: async (req, res) => {
    try {
      const {
        author_id
      } = req.params; // Lấy `author_id` từ URL params
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
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        };
      }
      const result = await ScientificPaper.aggregate([{
        $lookup: {
          from: "paperauthors",
          localField: "author",
          foreignField: "_id",
          as: "authorDetails"
        }
      }, {
        $match: {
          "authorDetails.user_id": author_id.toString(),
          status: "approved",
          ...dateFilter // Áp dụng bộ lọc theo năm học (nếu có)
        }
      }, {
        $count: "totalPapers"
      }]);
      const totalPapers = result.length > 0 ? result[0].totalPapers : 0;
      res.status(200).json({
        author_id,
        academicYear: academicYear || "All",
        total_papers: totalPapers
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
  getTotalViewsByAuthorId: async (req, res) => {
    try {
      const {
        author_id
      } = req.params;
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
          "viewDetails.createdAt": {
            $gte: startDate,
            $lte: endDate
          }
        };
      }
      const result = await ScientificPaper.aggregate([{
        $lookup: {
          from: "paperviews",
          localField: "_id",
          foreignField: "paper_id",
          as: "viewDetails"
        }
      }, {
        $lookup: {
          from: "paperauthors",
          localField: "author",
          foreignField: "_id",
          as: "authorDetails"
        }
      }, {
        $match: {
          "authorDetails.user_id": author_id.toString(),
          status: "approved",
          ...dateFilter // Áp dụng bộ lọc theo năm học (nếu có)
        }
      }, {
        $unwind: "$viewDetails"
      }, {
        $group: {
          _id: null,
          totalViews: {
            $sum: 1
          }
        }
      }]);
      const totalViews = result.length > 0 ? result[0].totalViews : 0;
      res.status(200).json({
        author_id,
        academicYear: academicYear || "All",
        total_views: totalViews
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
  getTotalDownloadsByAuthorId: async (req, res) => {
    try {
      const {
        author_id
      } = req.params;
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
          "downloadDetails.createdAt": {
            $gte: startDate,
            $lte: endDate
          }
        };
      }
      const result = await ScientificPaper.aggregate([{
        $lookup: {
          from: "paperdownloads",
          localField: "_id",
          foreignField: "paper_id",
          as: "downloadDetails"
        }
      }, {
        $lookup: {
          from: "paperauthors",
          localField: "author",
          foreignField: "_id",
          as: "authorDetails"
        }
      }, {
        $match: {
          "authorDetails.user_id": author_id.toString(),
          status: "approved",
          ...dateFilter // Áp dụng bộ lọc theo năm học (nếu có)
        }
      }, {
        $unwind: "$downloadDetails"
      }, {
        $group: {
          _id: null,
          totalDownloads: {
            $sum: 1
          }
        }
      }]);
      const totalDownloads = result.length > 0 ? result[0].totalDownloads : 0;
      res.status(200).json({
        author_id,
        academicYear: academicYear || "All",
        total_downloads: totalDownloads
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
  getTotalPointByAuthorId: async (req, res) => {
    try {
      const {
        author_id
      } = req.params; // Lấy `author_id` từ URL params
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
          "authorDetails.createdAt": {
            $gte: startDate,
            $lte: endDate
          }
        };
      }
      const result = await ScientificPaper.aggregate([{
        $lookup: {
          from: "paperauthors",
          localField: "author",
          foreignField: "_id",
          as: "authorDetails"
        }
      }, {
        $match: {
          "authorDetails.user_id": author_id.toString(),
          status: "approved",
          ...dateFilter // Áp dụng bộ lọc theo năm học (nếu có)
        }
      }, {
        $addFields: {
          authorDetails: {
            $filter: {
              input: "$authorDetails",
              as: "author",
              cond: {
                $eq: ["$$author.user_id", author_id.toString()]
              }
            }
          }
        }
      }, {
        $unwind: "$authorDetails"
      }, {
        $group: {
          _id: null,
          totalPoints: {
            $sum: "$authorDetails.point"
          }
        }
      }]);
      const totalPoints = result.length > 0 ? result[0].totalPoints : 0;

      // Trả về kết quả
      res.status(200).json({
        author_id,
        academicYear: academicYear || "All",
        total_points: totalPoints
      });
    } catch (error) {
      console.error("Error in getTotalPointByAuthorId:", error.message);
      res.status(500).json({
        message: "An error occurred while retrieving the total points",
        error: error.message
      });
    }
  },
  getTop5PapersByAuthorId: async (req, res) => {
    try {
      const {
        author_id
      } = req.params;
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
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        };
      }
      const result = await ScientificPaper.aggregate([{
        $lookup: {
          from: "paperauthors",
          localField: "_id",
          foreignField: "paper_id",
          as: "authorDetails"
        }
      }, {
        $unwind: {
          path: "$authorDetails",
          preserveNullAndEmptyArrays: false // Bỏ qua các bài không có tác giả
        }
      }, {
        $match: {
          "authorDetails.user_id": author_id.toString(),
          // Lọc theo `author_id`
          status: "approved",
          // Chỉ lấy các bài báo đã được duyệt
          ...dateFilter // Áp dụng bộ lọc theo năm học (nếu có)
        }
      }, {
        $lookup: {
          from: "paperviews",
          localField: "_id",
          foreignField: "paper_id",
          as: "viewDetails"
        }
      }, {
        $lookup: {
          from: "paperdownloads",
          localField: "_id",
          foreignField: "paper_id",
          as: "downloadDetails"
        }
      }, {
        $addFields: {
          viewCount: {
            $size: "$viewDetails"
          },
          // Tính số lượt xem
          downloadCount: {
            $size: "$downloadDetails"
          } // Tính số lượt tải
        }
      }, {
        $group: {
          _id: "$_id",
          // Nhóm theo bài báo
          title_vn: {
            $first: "$title_vn"
          },
          title_en: {
            $first: "$title_en"
          },
          viewCount: {
            $first: "$viewCount"
          },
          // Lấy số lượt xem
          downloadCount: {
            $first: "$downloadCount"
          },
          // Lấy số lượt tải
          contributionScore: {
            $sum: "$authorDetails.point"
          },
          // Tính tổng điểm đóng góp của tác giả
          authorDetails: {
            $push: "$authorDetails"
          } // Lưu danh sách tác giả
        }
      }, {
        $addFields: {
          totalScore: {
            $add: ["$contributionScore", "$viewCount", "$downloadCount"] // Tổng điểm của 3 tiêu chí
          }
        }
      }, {
        $sort: {
          totalScore: -1 // Sắp xếp theo tổng điểm giảm dần
        }
      }, {
        $limit: 5 // Lấy top 5 bài
      }, {
        $project: {
          paper_id: "$_id",
          title_vn: 1,
          title_en: 1,
          viewCount: 1,
          downloadCount: 1,
          contributionScore: 1,
          totalScore: 1,
          // Bao gồm tổng điểm trong kết quả
          authorDetails: {
            user_id: 1,
            author_name_vi: 1,
            author_name_en: 1,
            role: 1,
            point: 1
          }
        }
      }]);

      // Kiểm tra nếu không có bài nghiên cứu nào
      if (!result || result.length === 0) {
        return res.status(404).json({
          message: "No papers found for this author"
        });
      }

      // Trả về kết quả
      res.status(200).json({
        message: "Top 5 papers by author retrieved successfully",
        academicYear: academicYear || "All",
        papers: result
      });
    } catch (error) {
      console.error("Error in getTop5PapersByAuthorId:", error.message);
      res.status(500).json({
        message: "An error occurred while retrieving the top 5 papers by author",
        error: error.message
      });
    }
  },
  getStatisticsByDepartmentId: async (req, res) => {
    try {
      const {
        department_id
      } = req.params;
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
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        };
      }

      // 1. Lấy tất cả student_id và lecturer_id thuộc khoa
      const students = await Student.find({
        department: department_id
      }).select("student_id");
      const lecturers = await Lecturer.find({
        department: department_id
      }).select("lecturer_id");
      const userIds = [...students.map(s => s.student_id.toString()), ...lecturers.map(l => l.lecturer_id.toString())];
      if (userIds.length === 0) {
        return res.status(200).json({
          department_id,
          academicYear: academicYear || "All",
          total_papers: 0,
          total_views: 0,
          total_downloads: 0
        });
      }

      // 2. Lấy tất cả paper_id của người dùng trong khoa từ bảng papers_users
      const paperAuthors = await PaperAuthor.find({
        user_id: {
          $in: userIds
        }
      }).select("paper_id");
      const paperIds = [...new Set(paperAuthors.map(p => p.paper_id.toString()))]; // loại bỏ trùng

      if (paperIds.length === 0) {
        return res.status(200).json({
          department_id,
          academicYear: academicYear || "All",
          total_papers: 0,
          total_views: 0,
          total_downloads: 0
        });
      }

      // 3. Đếm số lượng paper đã được duyệt (status = "approved")
      const approvedPapers = await ScientificPaper.find({
        _id: {
          $in: paperIds
        },
        status: "approved",
        ...dateFilter // Áp dụng bộ lọc theo năm học (nếu có)
      }).select("_id");
      const approvedPaperIds = approvedPapers.map(p => p._id.toString());

      // 4. Đếm lượt xem
      const totalViews = await PaperView.countDocuments({
        paper_id: {
          $in: approvedPaperIds
        },
        ...dateFilter // Áp dụng bộ lọc theo năm học (nếu có)
      });

      // 5. Đếm lượt tải
      const totalDownloads = await PaperDownload.countDocuments({
        paper_id: {
          $in: approvedPaperIds
        },
        ...dateFilter // Áp dụng bộ lọc theo năm học (nếu có)
      });

      // 6. Trả kết quả
      res.status(200).json({
        department_id,
        academicYear: academicYear || "All",
        total_papers: approvedPaperIds.length,
        total_views: totalViews,
        total_downloads: totalDownloads
      });
    } catch (error) {
      console.error("Error in getStatisticsByDepartmentId:", error.message);
      res.status(500).json({
        message: error.message
      });
    }
  },
  getStatisticsForAll: async (req, res) => {
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
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        };
      }

      // 1. Lấy tất cả student_id và lecturer_id
      const students = await Student.find().select("student_id");
      const lecturers = await Lecturer.find().select("lecturer_id");
      const userIds = [...students.map(s => s.student_id.toString()), ...lecturers.map(l => l.lecturer_id.toString())];
      if (userIds.length === 0) {
        return res.status(200).json({
          total_papers: 0,
          total_views: 0,
          total_downloads: 0
        });
      }

      // 2. Lấy tất cả paper_id của người dùng từ bảng papers_users
      const paperAuthors = await PaperAuthor.find({
        user_id: {
          $in: userIds
        }
      }).select("paper_id");
      const paperIds = [...new Set(paperAuthors.map(p => p.paper_id.toString()))]; // loại bỏ trùng

      if (paperIds.length === 0) {
        return res.status(200).json({
          total_papers: 0,
          total_views: 0,
          total_downloads: 0
        });
      }

      // 3. Đếm số lượng paper đã được duyệt (status = "approved")
      const approvedPapers = await ScientificPaper.find({
        _id: {
          $in: paperIds
        },
        status: "approved",
        ...dateFilter // Áp dụng bộ lọc theo năm học (nếu có)
      }).select("_id");
      const approvedPaperIds = approvedPapers.map(p => p._id.toString());

      // 4. Đếm lượt xem
      const totalViews = await PaperView.countDocuments({
        paper_id: {
          $in: approvedPaperIds
        },
        ...dateFilter // Áp dụng bộ lọc theo năm học (nếu có)
      });

      // 5. Đếm lượt tải
      const totalDownloads = await PaperDownload.countDocuments({
        paper_id: {
          $in: approvedPaperIds
        },
        ...dateFilter // Áp dụng bộ lọc theo năm học (nếu có)
      });

      // 6. Trả kết quả
      res.status(200).json({
        academicYear: academicYear || "All",
        total_papers: approvedPaperIds.length,
        total_views: totalViews,
        total_downloads: totalDownloads
      });
    } catch (error) {
      console.error("Error in getStatisticsForAll:", error.message);
      res.status(500).json({
        message: error.message
      });
    }
  },
  getTotalPointsByDepartmentId: async (req, res) => {
    try {
      const {
        department_id
      } = req.params;
      const result = await ScientificPaper.aggregate([{
        $lookup: {
          from: "paperauthors",
          localField: "author",
          foreignField: "_id",
          as: "authorDetails"
        }
      }, {
        $lookup: {
          from: "departments",
          localField: "authorDetails.department_id",
          foreignField: "_id",
          as: "departmentDetails"
        }
      }, {
        $match: {
          "departmentDetails._id": department_id,
          status: "approved"
        }
      }, {
        $unwind: "$authorDetails"
      }, {
        $group: {
          _id: null,
          totalPoints: {
            $sum: "$authorDetails.point"
          }
        }
      }]);
      const totalPoints = result.length > 0 ? result[0].totalPoints : 0;
      res.status(200).json({
        department_id,
        total_points: totalPoints
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
  getTop5MostViewedAndDownloadedPapers: async (req, res) => {
    try {
      const topPapers = await ScientificPaper.aggregate([{
        $lookup: {
          from: "paperviews",
          localField: "_id",
          foreignField: "paper_id",
          as: "views"
        }
      }, {
        $lookup: {
          from: "paperdownloads",
          // Tên collection chứa lượt tải xuống
          localField: "_id",
          foreignField: "paper_id",
          as: "downloads"
        }
      }, {
        $lookup: {
          from: "paperauthors",
          // Tên collection chứa tác giả
          localField: "author",
          foreignField: "_id",
          as: "author"
        }
      }, {
        $addFields: {
          viewCount: {
            $size: "$views"
          },
          // Đếm số lượt xem
          downloadCount: {
            $size: "$downloads"
          } // Đếm số lượt tải xuống
        }
      }, {
        $sort: {
          viewCount: -1,
          downloadCount: -1
        } // Sắp xếp theo lượt xem và tải xuống giảm dần
      }, {
        $limit: 5
      }, {
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
            role: 1
          }
        }
      }]);

      // Kiểm tra nếu không có bài nghiên cứu nào
      if (!topPapers || topPapers.length === 0) {
        return res.status(404).json({
          message: "No scientific papers found"
        });
      }

      // Trả về kết quả
      res.status(200).json({
        message: "Top 5 most viewed and downloaded scientific papers retrieved successfully",
        papers: topPapers
      });
    } catch (error) {
      console.error("Error in getTop5MostViewedAndDownloadedPapers:", error.message);
      res.status(500).json({
        message: "An error occurred while retrieving the top 5 most viewed and downloaded scientific papers",
        error: error.message
      });
    }
  },
  getTop5MostViewedAndDownloadedPapersByDepartment: async (req, res) => {
    try {
      const {
        department_id
      } = req.params;
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
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        };
      }
      const topPapers = await ScientificPaper.aggregate([{
        $lookup: {
          from: "paperviews",
          localField: "_id",
          foreignField: "paper_id",
          as: "views"
        }
      }, {
        $lookup: {
          from: "paperdownloads",
          // Tên collection chứa lượt tải xuống
          localField: "_id",
          foreignField: "paper_id",
          as: "downloads"
        }
      }, {
        $lookup: {
          from: "paperauthors",
          // Tên collection chứa tác giả
          localField: "author",
          foreignField: "_id",
          as: "author"
        }
      }, {
        $match: {
          department: department_id,
          // Lọc theo khoa
          status: "approved",
          // Chỉ lấy bài đã được duyệt
          ...dateFilter // Áp dụng bộ lọc theo năm học (nếu có)
        }
      }, {
        $addFields: {
          viewCount: {
            $size: {
              $filter: {
                input: "$views",
                as: "view",
                cond: academicYear ? {
                  $and: [{
                    $gte: ["$$view.createdAt", dateFilter.createdAt.$gte]
                  }, {
                    $lte: ["$$view.createdAt", dateFilter.createdAt.$lte]
                  }]
                } : true // Không áp dụng bộ lọc nếu không có `academicYear`
              }
            }
          },
          downloadCount: {
            $size: {
              $filter: {
                input: "$downloads",
                as: "download",
                cond: academicYear ? {
                  $and: [{
                    $gte: ["$$download.createdAt", dateFilter.createdAt.$gte]
                  }, {
                    $lte: ["$$download.createdAt", dateFilter.createdAt.$lte]
                  }]
                } : true // Không áp dụng bộ lọc nếu không có `academicYear`
              }
            }
          }
        }
      }, {
        $sort: {
          viewCount: -1,
          downloadCount: -1
        }
      }, {
        $limit: 5
      }, {
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
            role: 1
          }
        }
      }]);

      // Kiểm tra nếu không có bài nghiên cứu nào
      if (!topPapers || topPapers.length === 0) {
        return res.status(200).json({
          message: "No scientific papers found for this department",
          academicYear: academicYear || "All"
        });
      }

      // Trả về kết quả
      res.status(200).json({
        message: "Top 5 most viewed and downloaded scientific papers by department retrieved successfully",
        academicYear: academicYear || "All",
        papers: topPapers
      });
    } catch (error) {
      console.error("Error in getTop5MostViewedAndDownloadedPapersByDepartment:", error.message);
      res.status(500).json({
        message: "An error occurred while retrieving the top 5 most viewed and downloaded scientific papers by department",
        error: error.message
      });
    }
  },
  getStatisticsByAllGroup: async (req, res) => {
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
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        };
      }

      // Lấy danh sách tất cả các nhóm
      const groups = await PaperGroup.find({}, {
        group_name: 1,
        _id: 0
      });

      // Thực hiện thống kê
      const statistics = await ScientificPaper.aggregate([{
        $match: {
          status: "approved",
          // Chỉ lấy các bài báo đã được duyệt
          ...dateFilter // Áp dụng bộ lọc theo năm học (nếu có)
        }
      }, {
        $lookup: {
          from: "papergroups",
          // Tên collection chứa thông tin nhóm
          localField: "article_group",
          foreignField: "_id",
          as: "groupDetails"
        }
      }, {
        $unwind: {
          path: "$groupDetails",
          // Tách mảng groupDetails thành các đối tượng riêng lẻ
          preserveNullAndEmptyArrays: true // Giữ lại các bài không có nhóm
        }
      }, {
        $group: {
          _id: "$groupDetails.group_name",
          // Nhóm theo tên nhóm
          count: {
            $sum: 1
          } // Đếm số lượng bài trong mỗi nhóm
        }
      }, {
        $project: {
          _id: 0,
          // Loại bỏ _id khỏi kết quả
          group: {
            $ifNull: ["$_id", "Unknown"]
          },
          // Nếu không có nhóm, đặt là "Unknown"
          count: 1 // Giữ lại trường count
        }
      }]);

      // Chuyển đổi kết quả thành key-value
      const result = {};
      groups.forEach(group => {
        result[group.group_name] = 0; // Gán mặc định là 0 cho tất cả các nhóm
      });
      statistics.forEach(stat => {
        result[stat.group] = stat.count; // Cập nhật số lượng bài cho các nhóm có dữ liệu
      });

      // Trả về kết quả
      res.status(200).json({
        message: "Statistics by group retrieved successfully",
        academicYear: academicYear || "All",
        data: result
      });
    } catch (error) {
      console.error("Error in getStatisticsByGroup:", error.message);
      res.status(500).json({
        message: "An error occurred while retrieving statistics by group",
        error: error.message
      });
    }
  },
  getStatisticsTop5ByAllDepartment: async (req, res) => {
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
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        };
      }

      // Lấy danh sách tất cả các khoa
      const departments = await Department.find({}, {
        department_name: 1,
        _id: 1
      });

      // Thực hiện thống kê
      const statistics = await ScientificPaper.aggregate([{
        $match: {
          status: "approved",
          // Chỉ lấy các bài báo đã được duyệt
          ...dateFilter // Áp dụng bộ lọc theo năm học (nếu có)
        }
      }, {
        $addFields: {
          departmentObjectId: {
            $toObjectId: "$department"
          } // Chuyển `department` thành ObjectId
        }
      }, {
        $group: {
          _id: "$departmentObjectId",
          // Nhóm theo ObjectId của khoa
          count: {
            $sum: 1
          }
        }
      }, {
        $lookup: {
          from: "departments",
          localField: "_id",
          foreignField: "_id",
          as: "departmentDetails"
        }
      }, {
        $unwind: {
          path: "$departmentDetails",
          preserveNullAndEmptyArrays: true
        }
      }, {
        $project: {
          _id: 0,
          department: {
            $ifNull: ["$departmentDetails.department_name", "Unknown"]
          },
          count: 1
        }
      }, {
        $sort: {
          count: -1
        } // Sắp xếp theo số lượng bài giảm dần
      }, {
        $limit: 5 // Lấy top 5 khoa
      }]);

      // Chuyển đổi kết quả thành key-value
      const result = {};
      statistics.forEach(stat => {
        result[stat.department] = stat.count; // Cập nhật số lượng bài cho các khoa
      });

      // Trả về kết quả
      res.status(200).json({
        message: "Top 5 departments by approved papers retrieved successfully",
        academicYear: academicYear || "All",
        data: result
      });
    } catch (error) {
      console.error("Error in getStatisticsByAllDepartment:", error.message);
      res.status(500).json({
        message: "An error occurred while retrieving statistics by department",
        error: error.message
      });
    }
  },
  getStatisticsTop5ByType: async (req, res) => {
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
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        };
      }

      // Lấy danh sách tất cả các loại bài báo
      const types = await PaperType.find({}, {
        type_name: 1,
        _id: 0
      });

      // Thực hiện thống kê
      const statistics = await ScientificPaper.aggregate([{
        $match: {
          status: "approved",
          // Chỉ lấy các bài báo đã được duyệt
          ...dateFilter // Áp dụng bộ lọc theo năm học (nếu có)
        }
      }, {
        $lookup: {
          from: "papertypes",
          // Tên collection chứa thông tin loại bài báo
          localField: "article_type",
          foreignField: "_id",
          as: "typeDetails"
        }
      }, {
        $unwind: {
          path: "$typeDetails",
          // Tách mảng typeDetails thành các đối tượng riêng lẻ
          preserveNullAndEmptyArrays: true // Giữ lại các bài không có loại
        }
      }, {
        $group: {
          _id: "$typeDetails.type_name",
          // Nhóm theo tên loại
          count: {
            $sum: 1
          } // Đếm số lượng bài trong mỗi loại
        }
      }, {
        $project: {
          _id: 0,
          // Loại bỏ _id khỏi kết quả
          type: {
            $ifNull: ["$_id", "Unknown"]
          },
          // Nếu không có loại, đặt là "Unknown"
          count: 1 // Giữ lại trường count
        }
      }, {
        $sort: {
          count: -1
        } // Sắp xếp theo số lượng bài giảm dần
      }, {
        $limit: 5 // Lấy top 5 loại bài báo
      }]);

      // Chuyển đổi kết quả thành key-value
      const result = {};
      types.forEach(type => {
        result[type.type_name] = 0; // Gán mặc định là 0 cho tất cả các loại
      });
      statistics.forEach(stat => {
        result[stat.type] = stat.count; // Cập nhật số lượng bài cho các loại có dữ liệu
      });

      // Trả về kết quả
      res.status(200).json({
        message: "Top 5 types by approved papers retrieved successfully",
        academicYear: academicYear || "All",
        data: result
      });
    } catch (error) {
      console.error("Error in getStatisticsTop5ByType:", error.message);
      res.status(500).json({
        message: "An error occurred while retrieving statistics by type",
        error: error.message
      });
    }
  },
  // Thống kê của khoa
  getStatisticsByGroupByDepartment: async (req, res) => {
    try {
      const {
        department_id
      } = req.params; // Lấy department_id từ request params
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
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        };
      }

      // Lấy danh sách tất cả các nhóm
      const groups = await PaperGroup.find({}, {
        group_name: 1,
        _id: 0
      });

      // Thực hiện thống kê
      const statistics = await ScientificPaper.aggregate([{
        $match: {
          department: department_id,
          // Lọc theo khoa cụ thể
          status: "approved",
          // Chỉ lấy các bài báo đã được duyệt
          ...dateFilter // Áp dụng bộ lọc theo năm học (nếu có)
        }
      }, {
        $lookup: {
          from: "papergroups",
          // Tên collection chứa thông tin nhóm
          localField: "article_group",
          foreignField: "_id",
          as: "groupDetails"
        }
      }, {
        $unwind: {
          path: "$groupDetails",
          // Tách mảng groupDetails thành các đối tượng riêng lẻ
          preserveNullAndEmptyArrays: true // Giữ lại các bài không có nhóm
        }
      }, {
        $group: {
          _id: "$groupDetails.group_name",
          // Nhóm theo tên nhóm
          count: {
            $sum: 1
          } // Đếm số lượng bài trong mỗi nhóm
        }
      }, {
        $project: {
          _id: 0,
          // Loại bỏ _id khỏi kết quả
          group: {
            $ifNull: ["$_id", "Unknown"]
          },
          // Nếu không có nhóm, đặt là "Unknown"
          count: 1 // Giữ lại trường count
        }
      }]);

      // Chuyển đổi kết quả thành key-value
      const result = {};
      groups.forEach(group => {
        result[group.group_name] = 0; // Gán mặc định là 0 cho tất cả các nhóm
      });
      statistics.forEach(stat => {
        result[stat.group] = stat.count; // Cập nhật số lượng bài cho các nhóm có dữ liệu
      });

      // Trả về kết quả
      res.status(200).json({
        message: `Statistics by group for department ${department_id} retrieved successfully`,
        academicYear: academicYear || "All",
        data: result
      });
    } catch (error) {
      console.error("Error in getStatisticsByGroupByDepartment:", error.message);
      res.status(500).json({
        message: "An error occurred while retrieving statistics by group for the department",
        error: error.message
      });
    }
  },
  getTop5AuthorsByDepartment: async (req, res) => {
    try {
      const {
        department_id
      } = req.params;
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
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        };
      }
      const topAuthors = await ScientificPaper.aggregate([{
        $match: {
          status: "approved",
          // Chỉ lấy bài đã duyệt
          ...dateFilter // Áp dụng bộ lọc theo năm học (nếu có)
        }
      }, {
        $lookup: {
          from: "paperauthors",
          localField: "_id",
          foreignField: "paper_id",
          as: "authors"
        }
      }, {
        $unwind: "$authors"
      }, {
        $lookup: {
          from: "lecturers",
          localField: "authors.user_id",
          foreignField: "lecturer_id",
          as: "lecturerInfo"
        }
      }, {
        $lookup: {
          from: "students",
          localField: "authors.user_id",
          foreignField: "student_id",
          as: "studentInfo"
        }
      }, {
        $addFields: {
          department: {
            $cond: [{
              $gt: [{
                $size: "$lecturerInfo"
              }, 0]
            }, {
              $arrayElemAt: ["$lecturerInfo.department", 0]
            }, {
              $arrayElemAt: ["$studentInfo.department", 0]
            }]
          },
          authorName: {
            $cond: [{
              $gt: [{
                $size: "$lecturerInfo"
              }, 0]
            }, {
              $arrayElemAt: ["$lecturerInfo.full_name", 0]
            }, {
              $arrayElemAt: ["$studentInfo.full_name", 0]
            }]
          },
          degree: {
            $cond: [{
              $gt: [{
                $size: "$lecturerInfo"
              }, 0]
            }, {
              $arrayElemAt: ["$lecturerInfo.degree", 0]
            }, {
              $arrayElemAt: ["$studentInfo.degree", 0]
            }]
          },
          userId: "$authors.user_id",
          point: "$authors.point"
        }
      }, {
        $match: {
          department: new mongoose.Types.ObjectId(department_id)
        }
      }, {
        $group: {
          _id: "$userId",
          authorName: {
            $first: "$authorName"
          },
          degree: {
            $first: "$degree"
          },
          totalPoints: {
            $sum: "$point"
          }
        }
      }, {
        $sort: {
          totalPoints: -1
        }
      }, {
        $limit: 5
      }, {
        $project: {
          _id: 0,
          author_id: "$_id",
          authorName: 1,
          degree: 1,
          totalPoints: 1
        }
      }]);
      return res.status(200).json({
        message: "Top 5 authors by point",
        academicYear: academicYear || "All",
        data: topAuthors
      });
    } catch (error) {
      console.error("Error getTop5AuthorsByDepartment:", error);
      return res.status(500).json({
        message: "Server error"
      });
    }
  },
  getStatisticsTop5ByTypeByDepartment: async (req, res) => {
    try {
      const {
        department_id
      } = req.params; // Lấy department_id từ request params
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
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        };
      }

      // Lấy danh sách tất cả các loại bài báo
      const types = await PaperType.find({}, {
        type_name: 1,
        _id: 0
      });

      // Thực hiện thống kê
      const statistics = await ScientificPaper.aggregate([{
        $match: {
          department: department_id,
          // Lọc theo khoa cụ thể
          status: "approved",
          // Chỉ lấy các bài báo đã được duyệt
          ...dateFilter // Áp dụng bộ lọc theo năm học (nếu có)
        }
      }, {
        $lookup: {
          from: "papertypes",
          // Tên collection chứa thông tin loại bài báo
          localField: "article_type",
          foreignField: "_id",
          as: "typeDetails"
        }
      }, {
        $unwind: {
          path: "$typeDetails",
          // Tách mảng typeDetails thành các đối tượng riêng lẻ
          preserveNullAndEmptyArrays: true // Giữ lại các bài không có loại
        }
      }, {
        $group: {
          _id: "$typeDetails.type_name",
          // Nhóm theo tên loại
          count: {
            $sum: 1
          } // Đếm số lượng bài trong mỗi loại
        }
      }, {
        $project: {
          _id: 0,
          // Loại bỏ _id khỏi kết quả
          type: {
            $ifNull: ["$_id", "Unknown"]
          },
          // Nếu không có loại, đặt là "Unknown"
          count: 1 // Giữ lại trường count
        }
      }, {
        $sort: {
          count: -1
        } // Sắp xếp theo số lượng bài giảm dần
      }, {
        $limit: 5 // Lấy top 5 loại bài báo
      }]);

      // Chuyển đổi kết quả thành key-value
      const result = {};
      types.forEach(type => {
        result[type.type_name] = 0; // Gán mặc định là 0 cho tất cả các loại
      });
      statistics.forEach(stat => {
        result[stat.type] = stat.count; // Cập nhật số lượng bài cho các loại có dữ liệu
      });

      // Trả về kết quả
      res.status(200).json({
        message: `Top 5 types by approved papers for department ${department_id} retrieved successfully`,
        academicYear: academicYear || "All",
        data: result
      });
    } catch (error) {
      console.error("Error in getStatisticsTop5ByTypeByDepartment:", error.message);
      res.status(500).json({
        message: "An error occurred while retrieving statistics by type for the department",
        error: error.message
      });
    }
  },
  // Thống kê của giảng viên và sinh viên
  getPaperGroupsByUser: async (req, res) => {
    try {
      const {
        user_id
      } = req.params; // Lấy user_id từ request params
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
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        };
      }

      // Lấy danh sách tất cả các nhóm bài báo
      const groups = await PaperGroup.find({}, {
        group_name: 1,
        _id: 0
      });

      // Thực hiện thống kê
      const statistics = await ScientificPaper.aggregate([{
        $lookup: {
          from: "paperauthors",
          // Kết nối với bảng tác giả
          localField: "_id",
          foreignField: "paper_id",
          as: "authorDetails"
        }
      }, {
        $unwind: {
          path: "$authorDetails",
          // Tách mảng authorDetails thành các đối tượng riêng lẻ
          preserveNullAndEmptyArrays: false // Bỏ qua các bài không có tác giả
        }
      }, {
        $match: {
          "authorDetails.user_id": user_id,
          // Lọc theo user_id
          status: "approved",
          // Chỉ lấy các bài báo đã được duyệt
          ...dateFilter // Áp dụng bộ lọc theo năm học (nếu có)
        }
      }, {
        $lookup: {
          from: "papergroups",
          // Kết nối với bảng nhóm bài báo
          localField: "article_group",
          foreignField: "_id",
          as: "groupDetails"
        }
      }, {
        $unwind: {
          path: "$groupDetails",
          // Tách mảng groupDetails thành các đối tượng riêng lẻ
          preserveNullAndEmptyArrays: true // Giữ lại các bài không có nhóm
        }
      }, {
        $group: {
          _id: "$groupDetails.group_name",
          // Nhóm theo tên nhóm
          count: {
            $sum: 1
          } // Đếm số lượng bài trong mỗi nhóm
        }
      }, {
        $project: {
          _id: 0,
          // Loại bỏ _id khỏi kết quả
          group: {
            $ifNull: ["$_id", "Unknown"]
          },
          // Nếu không có nhóm, đặt là "Unknown"
          count: 1 // Giữ lại trường count
        }
      }, {
        $sort: {
          count: -1
        } // Sắp xếp theo số lượng bài giảm dần
      }]);

      // Chuyển đổi kết quả thành key-value với mặc định là 0
      const result = {};
      groups.forEach(group => {
        result[group.group_name] = 0; // Gán mặc định là 0 cho tất cả các nhóm
      });
      statistics.forEach(stat => {
        result[stat.group] = stat.count; // Cập nhật số lượng bài cho các nhóm có dữ liệu
      });

      // Trả về kết quả
      res.status(200).json({
        message: `Groups for user ${user_id} retrieved successfully`,
        academicYear: academicYear || "All",
        data: result
      });
    } catch (error) {
      console.error("Error in getTop5PaperGroupsByUser:", error.message);
      res.status(500).json({
        message: "An error occurred while retrieving statistics by group for the user",
        error: error.message
      });
    }
  },
  getTop5PapersByPointByUser: async (req, res) => {
    try {
      const {
        author_id
      } = req.params;
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
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        };
      }
      const result = await ScientificPaper.aggregate([{
        $lookup: {
          from: "paperauthors",
          localField: "_id",
          foreignField: "paper_id",
          as: "authorDetails"
        }
      }, {
        $unwind: {
          path: "$authorDetails",
          preserveNullAndEmptyArrays: false
        }
      }, {
        $match: {
          "authorDetails.user_id": author_id.toString(),
          status: "approved",
          ...dateFilter // Áp dụng bộ lọc theo năm học (nếu có)
        }
      }, {
        $group: {
          _id: "$_id",
          title_vn: {
            $first: "$title_vn"
          },
          title_en: {
            $first: "$title_en"
          },
          contributionScore: {
            $sum: "$authorDetails.point"
          },
          // Tính tổng điểm đóng góp
          authorDetails: {
            $push: "$authorDetails"
          } // Lưu danh sách tác giả
        }
      }, {
        $sort: {
          contributionScore: -1
        } // Sắp xếp theo điểm đóng góp giảm dần
      }, {
        $limit: 5 // Lấy top 5 bài
      }, {
        $project: {
          paper_id: "$_id",
          title_vn: 1,
          title_en: 1,
          contributionScore: 1,
          authorDetails: {
            user_id: 1,
            author_name_vi: 1,
            author_name_en: 1,
            role: 1,
            point: 1
          }
        }
      }]);

      // Kiểm tra nếu không có bài nghiên cứu nào
      if (!result || result.length === 0) {
        return res.status(404).json({
          message: "No papers found for this author"
        });
      }

      // Trả về kết quả
      res.status(200).json({
        message: "Top 5 papers by author retrieved successfully",
        academicYear: academicYear || "All",
        papers: result
      });
    } catch (error) {
      console.error("Error in getTop5PapersByPointByUser:", error.message);
      res.status(500).json({
        message: "An error occurred while retrieving the top 5 papers by author",
        error: error.message
      });
    }
  },
  getTop5PaperTypesByUser: async (req, res) => {
    try {
      const {
        user_id
      } = req.params; // Lấy user_id từ request params
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
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        };
      }

      // Thực hiện thống kê
      const statistics = await ScientificPaper.aggregate([{
        $lookup: {
          from: "paperauthors",
          // Kết nối với bảng tác giả
          localField: "_id",
          foreignField: "paper_id",
          as: "authorDetails"
        }
      }, {
        $unwind: {
          path: "$authorDetails",
          // Tách mảng authorDetails thành các đối tượng riêng lẻ
          preserveNullAndEmptyArrays: false // Bỏ qua các bài không có tác giả
        }
      }, {
        $match: {
          "authorDetails.user_id": user_id,
          // Lọc theo user_id
          status: "approved",
          // Chỉ lấy các bài báo đã được duyệt
          ...dateFilter // Áp dụng bộ lọc theo năm học (nếu có)
        }
      }, {
        $lookup: {
          from: "papertypes",
          // Kết nối với bảng loại bài báo
          localField: "article_type",
          foreignField: "_id",
          as: "typeDetails"
        }
      }, {
        $unwind: {
          path: "$typeDetails",
          // Tách mảng typeDetails thành các đối tượng riêng lẻ
          preserveNullAndEmptyArrays: true // Giữ lại các bài không có loại
        }
      }, {
        $group: {
          _id: "$typeDetails.type_name",
          // Nhóm theo tên loại bài báo
          count: {
            $sum: 1
          } // Đếm số lượng bài trong mỗi loại
        }
      }, {
        $project: {
          _id: 0,
          // Loại bỏ _id khỏi kết quả
          type: {
            $ifNull: ["$_id", "Unknown"]
          },
          // Nếu không có loại, đặt là "Unknown"
          count: 1 // Giữ lại trường count
        }
      }, {
        $sort: {
          count: -1
        } // Sắp xếp theo số lượng bài giảm dần
      }, {
        $limit: 5 // Lấy top 5 loại bài báo
      }]);

      // Kiểm tra nếu không có dữ liệu
      if (!statistics || statistics.length === 0) {
        return res.status(404).json({
          message: "No paper types found for this user"
        });
      }

      // Trả về kết quả
      res.status(200).json({
        message: `Top 5 paper types for user ${user_id} retrieved successfully`,
        academicYear: academicYear || "All",
        data: statistics
      });
    } catch (error) {
      console.error("Error in getTop5PaperTypesByUser:", error.message);
      res.status(500).json({
        message: "An error occurred while retrieving top 5 paper types for the user",
        error: error.message
      });
    }
  }
};
module.exports = statisticsController;