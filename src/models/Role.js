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
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: function () {
        return this.role_name !== "admin";
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", roleSchema);
