const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paperGroupSchema = new Schema(
  {
    group_id: {
      type: String,
      required: true,
      unique: true,
    },
    group_name: {
      type: String,
      required: true,
    },
    group_score: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaperGroup", paperGroupSchema);
