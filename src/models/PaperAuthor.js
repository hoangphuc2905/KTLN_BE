const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paperAuthorSchema = new Schema(
  {
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
    author_name_vi: {
      type: String,
      required: true,
    },
    author_name_en: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    work_unit_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkUnit",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaperAuthor", paperAuthorSchema);
