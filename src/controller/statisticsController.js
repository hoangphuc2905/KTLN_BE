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
};

module.exports = statisticsController;
