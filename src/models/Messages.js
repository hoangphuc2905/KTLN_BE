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
      enum: [
        "Request for Edit",
        "Feedback",
        "Approved",
        "Request for Approval",
        "Rejection",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending Response", "Responded", "Completed"],
      required: true,
    },
    sender_id: {
      type: String,
      required: true,
    },
    sender_model: {
      type: String,
      required: true,
      enum: ["Student", "Lecturer"],
    },
    receiver_id: {
      type: String, 
      required: true,
    },
    receiver_model: {
      type: String,
      required: true,
      enum: ["Student", "Lecturer"],
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
    isread: {
      type: Boolean,
      default: false,
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
