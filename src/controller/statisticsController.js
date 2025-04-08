const ScientificPaper = require("../models/ScientificPaper");

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

  getTotalPapersByDepartmentId: async (req, res) => {
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
          $count: "totalPapers",
        },
      ]);

      const totalPapers = result.length > 0 ? result[0].totalPapers : 0;

      res.status(200).json({
        department_id,
        total_papers: totalPapers,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getTotalViewsByDepartmentId: async (req, res) => {
    try {
      const { department_id } = req.params;

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
        department_id,
        total_views: totalViews,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getTotalDownloadsByDepartmentId: async (req, res) => {
    try {
      const { department_id } = req.params;

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
        department_id,
        total_downloads: totalDownloads,
      });
    } catch (error) {
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
};

module.exports = statisticsController;
