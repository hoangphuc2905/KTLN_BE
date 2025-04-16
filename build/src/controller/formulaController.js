const ScoringFormula = require("../models/ScoringFormula");
const formulaController = {
  // Tạo mới công thức
  createFormula: async (req, res) => {
    try {
      const formula = new ScoringFormula(req.body);
      await formula.save();
      res.status(201).json(formula);
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  },
  updateFormula: async (req, res) => {
    try {
      const {
        id,
        ...updateData
      } = req.body;

      // Kiểm tra xem ID có được cung cấp không
      if (!id) {
        return res.status(400).json({
          message: "ID is required"
        });
      }

      // Tìm và cập nhật công thức
      const formula = await ScoringFormula.findByIdAndUpdate(id, updateData, {
        new: true,
        // Trả về tài liệu đã được cập nhật
        runValidators: true // Chạy các trình xác thực trong schema
      });

      // Nếu không tìm thấy công thức
      if (!formula) {
        return res.status(404).json({
          message: "Formula not found"
        });
      }
      res.status(200).json(formula);
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  },
  // Lấy công thức theo khoảng thời gian
  getFormulaByDateRange: async (req, res) => {
    try {
      const {
        startDate,
        endDate
      } = req.body;
      const query = {
        startDate: {
          $gte: new Date(startDate)
        }
      };
      if (endDate) {
        query.endDate = {
          $lte: new Date(endDate)
        };
      }
      const formula = await ScoringFormula.find(query).populate("formula.attribute", "name");
      if (!formula || formula.length === 0) {
        return res.status(404).json({
          message: "Formula not found"
        });
      }
      res.status(200).json(formula);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
  // Cập nhật công thức theo khoảng thời gian
  updateFormulaByDateRange: async (req, res) => {
    try {
      const {
        startDate,
        endDate,
        ...updateData
      } = req.body;
      const query = {
        startDate: {
          $gte: new Date(startDate)
        }
      };
      if (endDate) {
        query.endDate = {
          $lte: new Date(endDate)
        };
      }
      const formula = await ScoringFormula.findOneAndUpdate(query, updateData, {
        new: true,
        runValidators: true
      });
      if (!formula) {
        return res.status(404).json({
          message: "Formula not found"
        });
      }
      res.status(200).json(formula);
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  },
  // Xóa công thức theo khoảng thời gian
  deleteFormulaByDateRange: async (req, res) => {
    try {
      const {
        startDate,
        endDate
      } = req.body;
      const query = {
        startDate: {
          $gte: new Date(startDate)
        }
      };
      if (endDate) {
        query.endDate = {
          $lte: new Date(endDate)
        };
      }
      const formula = await ScoringFormula.findOneAndDelete(query);
      if (!formula) {
        return res.status(404).json({
          message: "Formula not found"
        });
      }
      res.status(200).json({
        message: "Formula deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
  // Lấy tất cả
  getAllFormula: async (req, res) => {
    try {
      const dateRanges = await ScoringFormula.find();
      res.status(200).json(dateRanges);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
  // Thêm một khoảng thời gian mới
  addNewDateRange: async (req, res) => {
    try {
      const {
        startDate,
        endDate
      } = req.body;
      const existingFormula = await ScoringFormula.findOne({
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      });
      if (existingFormula) {
        return res.status(400).json({
          message: "Date range already exists"
        });
      }
      const newFormula = new ScoringFormula({
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        formula: []
      });
      await newFormula.save();
      res.status(201).json(newFormula);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
};
module.exports = formulaController;