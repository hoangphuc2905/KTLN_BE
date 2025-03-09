const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userWorkSchema = new Schema(
  {
    work_unit_id: {
      type: String,
      ref: "WorkUnit",
      required: true,
    },
    user_id: {
      type: String,
      ref: "User",
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    role_vi: {
      type: String,
      required: true,
    },
    role_en: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserWork", userWorkSchema);
