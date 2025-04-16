const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const paperDownloadsSchema = new Schema({
  download_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  paper_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ScientificPaper",
    required: true
  },
  user_type: {
    type: String,
    enum: ["Lecturer", "Student"],
    required: false
  },
  user_id: {
    type: String,
    required: false,
    refPath: "user_type"
  },
  download_time: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});
module.exports = mongoose.model("PaperDownloads", paperDownloadsSchema);