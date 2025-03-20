const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lecturerSchema = new Schema(
  {
    lecturer_id: {
      type: String,
      required: true,
      unique: true,
    },
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    date_of_birth: {
      type: Date,
      required: true,
    },
    cccd: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
    score_year: {
      type: Number,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      enum: [
        "Bachelor",
        "Master",
        "Doctor",
        "Egineer",
        "Professor",
        "Ossociate_Professor",
      ],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lecturer", lecturerSchema);
