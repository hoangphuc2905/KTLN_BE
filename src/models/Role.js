const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roleSchema = new Schema(
  {
    role_name: {
      type: String,
      enum: [
        "admin",
        "lecturer",
        "head_of_department",
        "deputy_head_of_department",
        "department_in_charge",
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", roleSchema);
