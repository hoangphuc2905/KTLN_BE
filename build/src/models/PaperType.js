const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const paperTypeSchema = new Schema({
  type_name: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
module.exports = mongoose.model("PaperType", paperTypeSchema);