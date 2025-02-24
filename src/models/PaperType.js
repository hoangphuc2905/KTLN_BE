const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paperTypeSchema = new Schema(
  {
    type_id: {
      type: String,
      required: true,
      unique: true,
    },
    type_name: {
      type: String,
      required: true,
    },
    type_score: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaperType", paperTypeSchema);
