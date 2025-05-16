const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workUnitSchema = new Schema(
  {
    work_unit_id: {
      type: Number,
      required: true,
      unique: true,
    },
    name_vi: {
      type: String,
      required: true,
    },
    name_en: {
      type: String,
      required: true,
    },
    address_vi: {
      type: String,
      required: true,
    },
    address_en: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkUnit", workUnitSchema);
