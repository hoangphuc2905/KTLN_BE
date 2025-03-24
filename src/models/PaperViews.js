const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paperViewsSchema = new Schema(
  {
    view_id: {
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
      required: false,
    },
    view_time: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaperViews", paperViewsSchema);
