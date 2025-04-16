const mongoose = require("mongoose");
const AttributeSchema = new mongoose.Schema({
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: false
  },
  name: {
    type: String,
    required: true
  },
  values: {
    type: Map,
    of: Number,
    required: true
  }
});
const Attribute = mongoose.model("Attribute", AttributeSchema);
module.exports = Attribute;