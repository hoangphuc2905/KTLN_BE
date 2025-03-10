const mongoose = require("mongoose");

const FormulaSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Tên tiêu chí (ví dụ: journal_group, author_role)
  description: { type: String }, // Mô tả tiêu chí
  weight: { type: Number, required: true }, // Trọng số
  values: { type: Map, of: Number, required: true }, // Danh sách giá trị và hệ số
});

const ScoringFormulaSchema = new mongoose.Schema({
  year: { type: Number, required: true, unique: true }, // Năm áp dụng
  formula: { type: [FormulaSchema], required: true }, // Danh sách tiêu chí
});

const ScoringFormula = mongoose.model("ScoringFormula", ScoringFormulaSchema);

module.exports = ScoringFormula;
