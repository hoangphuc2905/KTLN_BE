const Attribute = require("../models/Attribute");

const attributeController = {
  // Tạo mới một Attribute
  createAttribute: async (req, res) => {
    try {
      const { name } = req.body;
      const existingAttribute = await Attribute.findOne({ name });
      if (existingAttribute) {
        return res
          .status(400)
          .json({ message: "Attribute name already exists" });
      }
      const attribute = new Attribute(req.body);
      await attribute.save();
      res.status(201).json(attribute);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Lấy all
  getAllAttributes: async (req, res) => {
    try {
      const attributes = await Attribute.find();
      res.status(200).json(attributes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAttributeById: async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ message: "ID is required" });
      }

      const attribute = await Attribute.findById(id);
      if (!attribute) {
        return res.status(404).json({ message: "Attribute not found" });
      }

      // Trả về toàn bộ thông tin của Attribute
      res.status(200).json(attribute);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  // Cập nhật Attribute theo tên
  updateAttributeByName: async (req, res) => {
    try {
      const { name, ...updateData } = req.body;
      const attribute = await Attribute.findOneAndUpdate({ name }, updateData, {
        new: true,
        runValidators: true,
      });
      if (!attribute) {
        return res.status(404).json({ message: "Attribute not found" });
      }
      res.status(200).json(attribute);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Xóa Attribute theo tên
  deleteAttributeByName: async (req, res) => {
    try {
      const { name } = req.body;
      const attribute = await Attribute.findOneAndDelete({ name });
      if (!attribute) {
        return res.status(404).json({ message: "Attribute not found" });
      }
      res.status(200).json({ message: "Attribute deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = attributeController;
