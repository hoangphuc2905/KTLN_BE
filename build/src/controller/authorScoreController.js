const ScoringFormula = require("../models/ScoringFormula");
const Attribute = require("../models/Attribute");
const ScientificPaper = require("../models/ScientificPaper");
const ArticleGroup = require("../models/PaperGroup");
const mongoose = require("mongoose");
exports.calculateScoreFromInput = async (req, res) => {
  try {
    const {
      createdAt,
      doi,
      featured,
      article_group,
      authors
    } = req.body;
    const publishDate = new Date(createdAt);
    const formula = await ScoringFormula.findOne({
      startDate: {
        $lte: publishDate
      },
      endDate: {
        $gte: publishDate
      }
    }).populate("formula.attribute");
    if (!formula) return res.status(404).json({
      message: "No formula found"
    });
    const authorScores = {};
    for (let i = 0; i < authors.length; i++) {
      const author = authors[i];
      let individualScore = 0;
      for (const item of formula.formula) {
        const attribute = item.attribute;
        const weight = item.weight;
        if (!attribute || !attribute.name || !attribute.values) continue;
        let attrValue = 0;
        switch (attribute.name) {
          case "author_role":
            if (attribute.values.has(author.role)) {
              attrValue = attribute.values.get(author.role);
            }
            break;
          case "degree":
            if (attribute.values.has(author.degree)) {
              attrValue = attribute.values.get(author.degree);
            }
            break;
          case "point":
            attrValue = author.point || 0;
            break;
          case "article_group":
            if (article_group && attribute.values.has(article_group)) {
              attrValue = attribute.values.get(article_group);
            }
            break;
          case "institution_count":
            const count = Array.isArray(author.institutions) ? author.institutions.length : 0;
            if (attribute.values.has(count)) {
              attrValue = attribute.values.get(count);
            }
            break;
          case "doi":
            if (attribute.values.has(!!doi)) {
              attrValue = attribute.values.get(!!doi);
            }
            break;
          case "featured":
            if (attribute.values.has(!!featured)) {
              attrValue = attribute.values.get(!!featured);
            }
            break;
          default:
            break;
        }
        individualScore += attrValue * (weight / 100);
      }
      authorScores[`author_${i + 1}`] = individualScore.toFixed(2);
    }
    const totalScore = Object.values(authorScores).reduce((sum, val) => sum + parseFloat(val), 0);
    return res.status(200).json({
      totalScore: totalScore.toFixed(2),
      authorScores
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server error"
    });
  }
};