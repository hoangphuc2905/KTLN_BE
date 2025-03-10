const ScoringFormula = require("../models/ScoringFormula");

const calculateTotalScore = async (paper, year) => {
  const formula = await ScoringFormula.findOne({ year });
  if (!formula) {
    throw new Error("Formula not found for the given year");
  }

  let totalScore = 0;

  formula.formula.forEach((component) => {
    const value = paper[component.name];
    const score = component.values.get(value) || 0;
    totalScore += score * component.weight;
  });

  return totalScore;
};

module.exports = calculateTotalScore;
