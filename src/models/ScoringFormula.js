const mongoose = require("mongoose");

const ScoringFormulaSchema = new mongoose.Schema({
  year: { type: Number, required: true, unique: true },
  formula: [
    {
      attribute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attribute",
        required: true,
      },
      weight: { type: Number, required: true },
    },
  ],
});

const ScoringFormula = mongoose.model("ScoringFormula", ScoringFormulaSchema);
module.exports = ScoringFormula;
