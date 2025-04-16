const {
  generateEmbedding
} = require("../utils/embeddingUtils");
const ScientificPaper = require("../models/ScientificPaper");
exports.semanticSearch = async (req, res) => {
  try {
    const {
      query,
      department,
      criteria
    } = req.body;
    if (!query) return res.status(400).json({
      message: "Missing query"
    });

    // Sinh embedding từ query
    const queryEmbedding = await generateEmbedding(query);

    // Xây dựng bộ lọc MongoDB
    const filter = {
      embedding: {
        $exists: true
      },
      status: "approved"
    }; // Chỉ lấy bài báo đã được phê duyệt và có embedding
    if (department) filter.department = department; // Lọc theo khoa
    if (criteria) {
      switch (criteria) {
        case "title":
          filter.$or = [{
            title_vn: {
              $regex: query,
              $options: "i"
            }
          },
          // Tìm kiếm theo tiêu đề tiếng Việt
          {
            title_en: {
              $regex: query,
              $options: "i"
            }
          } // Tìm kiếm theo tiêu đề tiếng Anh
          ];
          break;
        case "author":
          filter.$or = [{
            "author.author_name_vi": {
              $regex: query,
              $options: "i"
            }
          },
          // Tìm kiếm theo tên tác giả tiếng Việt
          {
            "author.author_name_en": {
              $regex: query,
              $options: "i"
            }
          } // Tìm kiếm theo tên tác giả tiếng Anh
          ];
          break;
        case "year":
          if (!isNaN(parseInt(query, 10))) {
            filter.publish_date = {
              $regex: `^${query}`,
              // Tìm kiếm theo năm xuất bản
              $options: "i"
            };
          } else {
            return res.status(400).json({
              message: "Invalid year format"
            });
          }
          break;
        case "keywords":
          filter.$or = [{
            keywords: {
              $regex: query,
              $options: "i"
            }
          } // Tìm kiếm theo từ khóa
          ];
          break;
        default:
          return res.status(400).json({
            message: "Invalid search criteria"
          });
      }
    }

    // Lấy danh sách bài báo phù hợp với bộ lọc
    const papers = await ScientificPaper.find(filter).populate("article_type").populate("article_group").populate({
      path: "author",
      populate: {
        path: "work_unit_id",
        model: "WorkUnit"
      }
    }).populate("views").populate("downloads").populate("department");

    // Nếu không có bài báo nào phù hợp với bộ lọc, trả về thông báo
    if (papers.length === 0) {
      return res.status(200).json({
        query,
        filters: {
          department,
          criteria
        },
        results: [],
        message: "No papers found matching the criteria"
      });
    }

    // Tính cosine similarity
    const cosineSimilarity = (a, b) => {
      const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
      const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
      const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
      return dot / (normA * normB);
    };

    // Tính điểm similarity cho từng bài báo
    const results = papers.map(paper => ({
      paper,
      score: cosineSimilarity(queryEmbedding, paper.embedding)
    }));

    // Sắp xếp kết quả theo điểm similarity
    results.sort((a, b) => b.score - a.score);

    // Trả về kết quả
    res.status(200).json({
      query,
      filters: {
        department,
        criteria
      },
      results: results.slice(0, 10) // Lấy top 10 kết quả
    });
  } catch (error) {
    console.error("Semantic search error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};