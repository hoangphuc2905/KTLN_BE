const PaperAuthor = require("../models/PaperAuthor");

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
      console.log("Route /paperauthor/summary called"); // Log kiểm tra

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
      ]);

      console.log("Aggregation Result:", paperAuthors); // Log kết quả
      if (paperAuthors.length === 0) {
        return res.status(404).json({ message: "Paper author not found" });
      }

      const result = paperAuthors.map((author, index) => ({
        STT: index + 1,
        TÁC_GIẢ: author.author_name_vi || author.author_name_en,
        CHỨC_VỤ: author.role,
        KHOA: author.work_unit?.name_vi || "N/A",
        TỔNG_BÀI: author.total_papers,
        TỔNG_ĐIỂM: author.total_points,
      }));

      res.status(200).json(result);
    } catch (error) {
      console.error("Error:", error); // Log lỗi
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
