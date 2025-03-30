const Messages = require("../models/Messages");

const messagesController = {
  // Tạo một thông báo mới
  createMessage: async (req, res) => {
    try {
      console.log("Data received in createMessage:", req.body); // Kiểm tra dữ liệu đầu vào
      const message = new Messages(req.body);
      await message.save();
      console.log("Message saved successfully:", message); // Kiểm tra xem dữ liệu có được lưu không
      res.status(201).json({
        message: "Message created successfully",
        data: message,
      });
    } catch (error) {
      console.error("Error in createMessage:", error.message); // Ghi log lỗi
      res.status(400).json({ message: error.message });
    }
  },

  // Lấy tất cả thông báo
  getAllMessages: async (req, res) => {
    try {
      const messages = await Messages.find()
        .populate("sender_id") // Populate thông tin người gửi
        .populate("receiver_id") // Populate thông tin người nhận
        .populate("paper_id"); // Populate thông tin bài báo
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Lấy tất cả thông báo dành cho một người nhận cụ thể
  getMessagesByReceiverId: async (req, res) => {
    try {
      const { receiverId } = req.params; // Lấy receiverId từ params

      // Tìm tất cả thông báo có receiver_id khớp với receiverId
      const messages = await Messages.find({ receiver_id: receiverId })
        .populate("sender_id") // Populate thông tin người gửi
        .populate("receiver_id") // Populate thông tin người nhận
        .populate("paper_id"); // Populate thông tin bài báo

      if (!messages || messages.length === 0) {
        return res
          .status(404)
          .json({ message: "No messages found for this receiver" });
      }

      res.status(200).json(messages);
    } catch (error) {
      console.error("Error in getMessagesByReceiverId:", error.message);
      res.status(500).json({ message: error.message });
    }
  },

  // Lấy thông báo theo ID
  getMessageById: async (req, res) => {
    try {
      const message = await Messages.findById(req.params.id)
        .populate("sender_id")
        .populate("receiver_id")
        .populate("paper_id");
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.status(200).json(message);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Cập nhật thông báo theo ID
  updateMessageById: async (req, res) => {
    try {
      const message = await Messages.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      )
        .populate("sender_id")
        .populate("receiver_id")
        .populate("paper_id");
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.status(200).json({
        message: "Message updated successfully",
        data: message,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  markMessageAsRead: async (req, res) => {
    try {
      const { id } = req.params; // Lấy ID của thông báo từ URL params

      // Cập nhật trạng thái isread thành true
      const message = await Messages.findByIdAndUpdate(
        id,
        { isread: true },
        { new: true }
      );

      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }

      res.status(200).json({
        message: "Message marked as read successfully",
        data: message,
      });
    } catch (error) {
      console.error("Error in markMessageAsRead:", error.message);
      res.status(500).json({ message: error.message });
    }
  },

  // Xóa thông báo theo ID
  deleteMessageById: async (req, res) => {
    try {
      const message = await Messages.findByIdAndDelete(req.params.id);
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = messagesController;
