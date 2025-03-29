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

  deletePaperAuthorById: async (req, res) => {
    try {
      const { id } = req.params; // Updated parameter name
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
