const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messagesSchema = new Schema(
  {
    message_id: {
      type: String,
      required: true,
      unique: true,
    },
    message_type: {
      type: String,
      enum: ["Request for Edit", "Feedback", "Approved"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending Response", "Responded", "Completed"], 
    },
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paper_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ScientificPaper",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Messages", messagesSchema);
