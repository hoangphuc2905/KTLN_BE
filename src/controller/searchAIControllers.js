const { generateEmbedding } = require("../utils/embeddingUtils");
const ScientificPaper = require("../models/ScientificPaper");

exports.semanticSearch = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ message: "Missing query" });

    const queryEmbedding = await generateEmbedding(query);

    const papers = await ScientificPaper.find({ embedding: { $exists: true } });

    // Tính cosine similarity
    const similarity = (a, b) => {
      const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
      const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
      const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
      return dot / (normA * normB);
    };

    const results = papers.map((paper) => ({
      paper,
      score: similarity(queryEmbedding, paper.embedding),
    }));

    results.sort((a, b) => b.score - a.score);

    res.status(200).json({
      query,
      results: results.slice(0, 10),
    });
  } catch (error) {
    console.error("Semantic search error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
