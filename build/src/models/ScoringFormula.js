const mongoose = require("mongoose");
const ScoringFormulaSchema = new mongoose.Schema({
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: false
  },
  formula: [{
    attribute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attribute",
      required: true
    },
    weight: {
      type: Number,
      required: true
    }
  }]
}, {
  timestamps: true
});
const ScoringFormula = mongoose.model("ScoringFormula", ScoringFormulaSchema);
module.exports = ScoringFormula;