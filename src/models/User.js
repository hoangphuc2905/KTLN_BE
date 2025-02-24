const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    user_id: {
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
    role_id: {
      type: String,
      enum: ["admin", "student", "lecturer"],
      required: true,
    },
    score_year: {
      type: Number,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
