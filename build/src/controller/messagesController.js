const Messages = require("../models/Messages");
const messagesController = {
  createMessage: async (req, res) => {
    try {
      const message = new Messages(req.body);
      await message.save();
      res.status(201).json({
        message: "Message created successfully",
        data: message
      });
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  },
  getAllMessages: async (req, res) => {
    try {
      const messages = await Messages.find().populate("sender_id").populate("receiver_id").populate("paper_id");
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
  getMessagesByReceiverId: async (req, res) => {
    try {
      const {
        receiverId
      } = req.params;
      const messages = await Messages.find({
        receiver_id: receiverId
      }).populate("sender_id").populate("receiver_id").populate("paper_id");
      if (!messages || messages.length === 0) {
        return res.status(404).json({
          message: "No messages found for this receiver"
        });
      }
      res.status(200).json(messages);
    } catch (error) {
      console.error("Error in getMessagesByReceiverId:", error.message);
      res.status(500).json({
        message: error.message
      });
    }
  },
  getMessageById: async (req, res) => {
    try {
      const message = await Messages.findById(req.params.id).populate("sender_id").populate("receiver_id").populate("paper_id");
      if (!message) {
        return res.status(404).json({
          message: "Message not found"
        });
      }
      res.status(200).json(message);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
  updateMessageById: async (req, res) => {
    try {
      const message = await Messages.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      }).populate("sender_id").populate("receiver_id").populate("paper_id");
      if (!message) {
        return res.status(404).json({
          message: "Message not found"
        });
      }
      res.status(200).json({
        message: "Message updated successfully",
        data: message
      });
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  },
  markMessageAsRead: async (req, res) => {
    try {
      const {
        id
      } = req.params;
      const message = await Messages.findByIdAndUpdate(id, {
        isread: true
      }, {
        new: true
      });
      if (!message) {
        return res.status(404).json({
          message: "Message not found"
        });
      }
      res.status(200).json({
        message: "Message marked as read successfully",
        data: message
      });
    } catch (error) {
      console.error("Error in markMessageAsRead:", error.message);
      res.status(500).json({
        message: error.message
      });
    }
  },
  getMessagesByStatusRejectionByPaperId: async (req, res) => {
    try {
      const {
        paperId
      } = req.params;
      const messages = await Messages.findOne({
        paper_id: paperId,
        message_type: "Rejection"
      }).sort({
        time: -1
      });
      if (!messages || messages.length === 0) {
        return res.status(404).json({
          message: "No messages found for this paper"
        });
      }
      const reasonIndex = messages.content.indexOf("Lý do:");
      if (reasonIndex !== -1) {
        messages.content = messages.content.substring(reasonIndex + 7).trim();
      }
      res.status(200).json(messages);
    } catch (error) {
      console.error("Error in getMessagesByPaperId:", error.messages);
      res.status(500).json({
        messages: error.messages
      });
    }
  },
  getMessagesByStatusRequestforEditByPaperId: async (req, res) => {
    try {
      const {
        paperId
      } = req.params;
      const messages = await Messages.findOne({
        paper_id: paperId,
        message_type: "Request for Edit"
      }).sort({
        time: -1
      });
      if (!messages || messages.length === 0) {
        return res.status(404).json({
          message: "No messages found for this paper"
        });
      }
      const contentPrefix = `Yêu cầu chỉnh sửa bài báo`;
      const prefixIndex = messages.content.indexOf(contentPrefix);
      if (prefixIndex !== -1) {
        const requestContentStart = messages.content.indexOf(": ", prefixIndex);
        if (requestContentStart !== -1) {
          messages.content = messages.content.substring(requestContentStart + 2).trim();
        }
      }
      res.status(200).json(messages);
    } catch (error) {
      console.error("Error in getRequestContentByPaperId:", error.messages);
      res.status(500).json({
        messages: error.messages
      });
    }
  },
  deleteMessageById: async (req, res) => {
    try {
      const message = await Messages.findByIdAndDelete(req.params.id);
      if (!message) {
        return res.status(404).json({
          message: "Message not found"
        });
      }
      res.status(200).json({
        message: "Message deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
};
module.exports = messagesController;