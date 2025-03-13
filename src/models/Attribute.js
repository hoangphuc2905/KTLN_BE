const mongoose = require("mongoose");

const AttributeSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  name: { type: String, required: true },
  values: { type: Map, of: Number, required: true },
});

const Attribute = mongoose.model("Attribute", AttributeSchema);

module.exports = Attribute;