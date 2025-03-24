const ScientificPaper = require("../models/ScientificPaper");
const PaperViews = require("../models/PaperViews"); // Import model PaperViews
const PaperDownloads = require("../models/PaperDownloads"); // Import model PaperDownloads
const { v4: uuidv4 } = require("uuid"); // Sử dụng để tạo view_id và download_id

const scientificPaperController = {
  createScientificPaper: async (req, res) => {
    try {
      // Lấy bài báo gần nhất dựa trên `paper_id`
      const lastPaper = await ScientificPaper.findOne().sort({ paper_id: -1 });

      // Tạo mã bài báo mới
      let newPaperId;
      if (lastPaper && lastPaper.paper_id) {
        const lastIdNumber = parseInt(lastPaper.paper_id, 10); // Chuyển "000001" thành 1
        newPaperId = String(lastIdNumber + 1).padStart(6, "0"); // Tăng lên 1 và định dạng lại thành "000002"
      } else {
        newPaperId = "000001"; // Nếu chưa có bài báo nào, bắt đầu từ "000001"
      }

      // Lưu bài báo trước
      const scientificPaper = new ScientificPaper({
        ...req.body,
        paper_id: newPaperId, // Gán mã tự động vào bài báo
      });
      await scientificPaper.save();

      // Tạo bản ghi mới cho views
      const newViews = new PaperViews({
        view_id: uuidv4(), // Tạo view_id ngẫu nhiên
        paper_id: scientificPaper._id, // Liên kết với bài báo vừa tạo
        user_id: null, // Nếu không có user_id, để null
        view_time: new Date(), // Thời gian hiện tại
      });
      await newViews.save();

      // Tạo bản ghi mới cho downloads
      const newDownloads = new PaperDownloads({
        download_id: uuidv4(), // Tạo download_id ngẫu nhiên
        paper_id: scientificPaper._id, // Liên kết với bài báo vừa tạo
        user_id: null, // Nếu không có user_id, để null
        download_time: new Date(), // Thời gian hiện tại
      });
      await newDownloads.save();

      // Cập nhật bài báo với `views` và `downloads`
      scientificPaper.views = newViews._id;
      scientificPaper.downloads = newDownloads._id;
      await scientificPaper.save();

      res.status(201).json({
        message: "Scientific paper created successfully",
        scientificPaper,
        views: newViews,
        downloads: newDownloads,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getAllScientificPapers: async (req, res) => {
    try {
      const scientificPapers = await ScientificPaper.find()
        .populate("article_type")
        .populate("article_group")
        .populate("views")
        .populate("downloads");
      res.status(200).json(scientificPapers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getScientificPaperById: async (req, res) => {
    try {
      const scientificPaper = await ScientificPaper.findById(req.params.id)
        .populate("article_type")
        .populate("article_group")
        .populate("views")
        .populate("downloads");
      if (!scientificPaper) {
        return res.status(404).json({ message: "ScientificPaper not found" });
      }
      res.status(200).json(scientificPaper);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateScientificPaperById: async (req, res) => {
    try {
      const scientificPaper = await ScientificPaper.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      )
        .populate("article_type")
        .populate("article_group")
        .populate("views")
        .populate("downloads");
      if (!scientificPaper) {
        return res.status(404).json({ message: "ScientificPaper not found" });
      }
      res.status(200).json(scientificPaper);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = scientificPaperController;
