const ScientificPaper = require("../models/ScientificPaper");

function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dot / (magA * magB);
}

exports.getRecommendations = async (req, res) => {
  try {
    const { paperId } = req.params;

    const currentPaper = await ScientificPaper.findById(paperId);
    if (!currentPaper || !currentPaper.embedding) {
      return res
        .status(404)
        .json({ message: "Paper not found or no embedding" });
    }

    // Tìm các bài báo khác (đã duyệt)
    const otherPapers = await ScientificPaper.find({
      _id: { $ne: paperId },
      status: "approved",
      embedding: { $exists: true },
    })
      .populate("article_type")
      .populate("article_group")
      .populate({
        path: "author",
        populate: {
          path: "work_unit_id",
          model: "WorkUnit",
        },
      })
      .populate("views")
      .populate("downloads");

    // Tính điểm tương đồng
    const results = otherPapers.map((paper) => {
      const score = cosineSimilarity(currentPaper.embedding, paper.embedding);
      return {
        ...paper._doc,
        similarity: score,
      };
    });

    // Sắp xếp và trả về top 5
    const sorted = results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);

    return res.status(200).json({ data: sorted });
  } catch (err) {
    console.error("Error in getRecommendations:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
