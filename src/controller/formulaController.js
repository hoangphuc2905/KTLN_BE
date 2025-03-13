const ScoringFormula = require("../models/ScoringFormula");

const formulaController = {
  createFormula: async (req, res) => {
    try {
      const formula = new ScoringFormula(req.body);
      await formula.save();
      res.status(201).json(formula);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getFormulaByYear: async (req, res) => {
    try {
      const formula = await ScoringFormula.findOne({
        year: req.params.year,
      }).populate("formula.attribute", "name");
      if (!formula) {
        return res.status(404).json({ message: "Formula not found" });
      }
      res.status(200).json(formula);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateFormulaByYear: async (req, res) => {
    try {
      const formula = await ScoringFormula.findOneAndUpdate(
        { year: req.params.year },
        req.body,
        { new: true, runValidators: true }
      );
      if (!formula) {
        return res.status(404).json({ message: "Formula not found" });
      }
      res.status(200).json(formula);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteFormulaByYear: async (req, res) => {
    try {
      const formula = await ScoringFormula.findOneAndDelete({
        year: req.params.year,
      });
      if (!formula) {
        return res.status(404).json({ message: "Formula not found" });
      }
      res.status(200).json({ message: "Formula deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = formulaController;
