const ScientificPaper = require("../models/ScientificPaper");
const PaperDownload = require("../models/PaperDownloads");
const PaperView = require("../models/PaperViews");
function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dot / (magA * magB);
}
exports.getRecommendations = async (req, res) => {
  try {
    const {
      paperId
    } = req.params;
    const currentPaper = await ScientificPaper.findById(paperId);
    if (!currentPaper || !currentPaper.embedding) {
      return res.status(404).json({
        message: "Paper not found or no embedding"
      });
    }

    // Tìm các bài báo khác (đã duyệt)
    const otherPapers = await ScientificPaper.find({
      _id: {
        $ne: paperId
      },
      status: "approved",
      embedding: {
        $exists: true
      }
    }).populate("article_type").populate("article_group").populate({
      path: "author",
      populate: {
        path: "work_unit_id",
        model: "WorkUnit"
      }
    }).populate("views").populate("downloads");

    // Tính điểm tương đồng
    const results = otherPapers.map(paper => {
      const score = cosineSimilarity(currentPaper.embedding, paper.embedding);
      return {
        ...paper._doc,
        similarity: score
      };
    });

    // Sắp xếp và trả về top 5
    const sorted = results.sort((a, b) => b.similarity - a.similarity).slice(0, 5);
    return res.status(200).json({
      data: sorted
    });
  } catch (err) {
    console.error("Error in getRecommendations:", err);
    return res.status(500).json({
      message: "Server error"
    });
  }
};
exports.getRecommendationsByUserHistory = async (req, res) => {
  try {
    const {
      userId
    } = req.params;

    // 1. Lấy tất cả paper_id từ downloads và views
    const downloads = await PaperDownload.find({
      user_id: userId
    });
    const views = await PaperView.find({
      user_id: userId
    });
    const interactedPaperIds = [...new Set([...downloads.map(d => d.paper_id.toString()), ...views.map(v => v.paper_id.toString())])];
    if (interactedPaperIds.length === 0) return res.status(200).json({
      message: "No data found",
      data: []
    });

    // 2. Lấy embedding của các bài đã tương tác
    const viewedPapers = await ScientificPaper.find({
      _id: {
        $in: interactedPaperIds
      },
      status: "approved",
      embedding: {
        $exists: true
      }
    });
    if (viewedPapers.length === 0) return res.status(200).json({
      message: "No embeddings found",
      data: []
    });

    // 3. Tính trung bình embedding
    const avgEmbedding = Array(viewedPapers[0].embedding.length).fill(0);
    for (const paper of viewedPapers) {
      paper.embedding.forEach((val, i) => avgEmbedding[i] += val);
    }
    for (let i = 0; i < avgEmbedding.length; i++) {
      avgEmbedding[i] /= viewedPapers.length;
    }

    // 4. Lấy các bài báo khác (chưa xem hoặc tải)
    const otherPapers = await ScientificPaper.find({
      _id: {
        $nin: interactedPaperIds
      },
      status: "approved",
      embedding: {
        $exists: true
      }
    }).populate("article_type").populate("article_group").populate({
      path: "author",
      populate: {
        path: "work_unit_id",
        model: "WorkUnit"
      }
    }).populate("views").populate("downloads").populate({
      path: "department",
      select: "department_name"
    });

    // 5. Hàm tính cosine similarity
    const cosineSimilarity = (a, b) => {
      const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
      const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
      const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
      return dot / (magA * magB);
    };

    // 6. Tính điểm tương đồng
    const scored = otherPapers.map(paper => ({
      ...paper._doc,
      similarity: cosineSimilarity(avgEmbedding, paper.embedding)
    }));

    // 7. Trả về top 10 gợi ý
    const topPapers = scored.sort((a, b) => b.similarity - a.similarity).slice(0, 100);
    return res.status(200).json({
      message: "Recommended papers based on views and downloads",
      data: topPapers
    });
  } catch (err) {
    console.error("❌ Recommendation error:", err.message);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message
    });
  }
};