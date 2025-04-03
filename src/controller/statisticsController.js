const ScientificPaper = require("../models/ScientificPaper");

const statisticsController = {
  getTotalPapersByAuthorId: async (req, res) => {
    try {
      const { author_id } = req.params.author_id;

      const totalPapers = await ScientificPaper.countDocuments({
        author: author_id,
      });

      res.status(200).json({
        author_id,
        total_papers: totalPapers,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = statisticsController;
