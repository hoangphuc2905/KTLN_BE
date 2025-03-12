const mongoose = require("mongoose");

const FormulaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String }, 
  weight: { type: Number, required: true },
  values: { type: Map, of: Number, required: true }, 
});

const ScoringFormulaSchema = new mongoose.Schema({
  year: { type: Number, required: true, unique: true },
  formula: { type: [FormulaSchema], required: true }, 
});

const ScoringFormula = mongoose.model("ScoringFormula", ScoringFormulaSchema);

module.exports = ScoringFormula;
