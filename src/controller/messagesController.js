const Messages = require("../models/Messages");

const messagesController = {
  createMessage: async (req, res) => {
    try {
      const message = new Messages(req.body);
      await message.save();
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getAllMessages: async (req, res) => {
    try {
      const messages = await Messages.find()
        .populate('sender_id')
        .populate('receiver_id')
        .populate('paper_id');
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getMessageById: async (req, res) => {
    try {
      const message = await Messages.findById(req.params.id)
        .populate('sender_id')
        .populate('receiver_id')
        .populate('paper_id');
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.status(200).json(message);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateMessageById: async (req, res) => {
    try {
      const message = await Messages.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      )
        .populate('sender_id')
        .populate('receiver_id')
        .populate('paper_id');
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.status(200).json(message);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

};

module.exports = messagesController;