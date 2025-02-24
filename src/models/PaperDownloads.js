const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paperDownloadsSchema = new Schema(
  {
    download_id: {
      type: String,
      required: true,
      unique: true,
    },
    paper_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ScientificPaper",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    download_time: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaperDownloads", paperDownloadsSchema);
