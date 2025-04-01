const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paperCollectionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user_type: {
      type: String,
      enum: ["Lecturer", "Student"],
      required: false,
    },
    user_id: {
      type: String,
      required: false,
      refPath: "user_type",
    },
    papers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ScientificPaper",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaperCollection", paperCollectionSchema);
