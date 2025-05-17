const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userTokenSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Account",
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: "7d",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserToken", userTokenSchema);
