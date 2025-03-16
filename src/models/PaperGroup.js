const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paperGroupSchema = new Schema(
  {
    group_name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaperGroup", paperGroupSchema);
