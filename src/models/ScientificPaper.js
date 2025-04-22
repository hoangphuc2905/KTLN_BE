const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scientificPaperSchema = new Schema(
  {
    paper_id: {
      type: String,
      required: true,
      unique: true,
    },
    article_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaperType",
      required: true,
    },
    article_group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaperGroup",
      required: true,
    },
    title_vn: {
      type: String,
      required: true,
    },
    title_en: {
      type: String,
      required: false,
    },
    author_count: {
      type: String,
      required: true,
    },
    author: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PaperAuthor",
        required: false,
      },
    ],
    publish_date: {
      type: Date,
      required: true,
    },
    magazine_vi: {
      type: String,
      required: true,
    },
    magazine_en: {
      type: String,
      required: false,
    },
    magazine_type: {
      type: String,
      required: false,
    },
    page: {
      type: Number,
      required: true,
    },
    issn_isbn: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    doi: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "refused", "revision"],
      default: "pending",
      required: true,
    },
    order_no: {
      type: Boolean,
      required: true,
    },
    featured: {
      type: Boolean,
      required: true,
    },
    keywords: {
      type: String,
      required: true,
    },
    views: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaperViews",
      required: false,
    },
    downloads: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaperDownloads",
      required: false,
    },
    summary: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      ref: "Department",
      required: true,
    },
    cover_image: {
      type: String,
      required: true,
    },
    embedding: {
      type: [Number],
      default: [],
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ScientificPaper", scientificPaperSchema);
