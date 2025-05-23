const ScoringFormula = require("../models/ScoringFormula");
const formulaController = {
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
      if (!id) {
        return res.status(400).json({
          message: "ID is required"
        });
      }
      const formula = await ScoringFormula.findByIdAndUpdate(id, updateData, {
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
  getFormulaByDate: async (req, res) => {
    try {
      const {
        date
      } = req.body;
      if (!date) {
        return res.status(400).json({
          message: "Date is required"
        });
      }
      const inputDate = new Date(date);
      const formula = await ScoringFormula.findOne({
        startDate: {
          $lte: inputDate
        },
        $or: [{
          endDate: {
            $gte: inputDate
          }
        }, {
          endDate: null
        }]
      }).populate("formula.attribute");
      if (!formula) {
        return res.status(404).json({
          message: "Formula not found"
        });
      }
      const result = {
        _id: formula._id,
        startDate: formula.startDate,
        endDate: formula.endDate,
        formula: formula.formula.map(f => ({
          attribute: f.attribute.name || f.attribute,
          values: f.attribute.values || null,
          weight: f.weight
        }))
      };
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
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
  getAllFormula: async (req, res) => {
    try {
      const dateRanges = await ScoringFormula.find().sort({
        startDate: -1
      });
      res.status(200).json(dateRanges);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
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