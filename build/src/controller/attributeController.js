const Attribute = require("../models/Attribute");
const ScoringFormula = require("../models/ScoringFormula");
const attributeController = {
  createAttribute: async (req, res) => {
    try {
      const {
        name
      } = req.body;
      const existingAttribute = await Attribute.findOne({
        name
      });
      if (existingAttribute) {
        return res.status(400).json({
          message: "Thuộc tính đã tồn tại"
        });
      }
      const attribute = new Attribute(req.body);
      await attribute.save();
      res.status(201).json(attribute);
    } catch (error) {
      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          message: "Lỗi xác thực",
          errors
        });
      }
      res.status(400).json({
        message: error.message
      });
    }
  },
  getAllAttributes: async (req, res) => {
    try {
      const attributes = await Attribute.find();
      res.status(200).json(attributes);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
  getAttributeById: async (req, res) => {
    try {
      const {
        id
      } = req.body;
      if (!id) {
        return res.status(400).json({
          message: "ID is required"
        });
      }
      const attribute = await Attribute.findById(id);
      if (!attribute) {
        return res.status(404).json({
          message: "Attribute not found"
        });
      }
      res.status(200).json(attribute);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
  updateAttributeByName: async (req, res) => {
    try {
      const {
        name,
        ...updateData
      } = req.body;
      const attribute = await Attribute.findOneAndUpdate({
        name
      }, updateData, {
        new: true,
        runValidators: true
      });
      if (!attribute) {
        return res.status(404).json({
          message: "Attribute not found"
        });
      }
      res.status(200).json(attribute);
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  },
  deleteAttributeByName: async (req, res) => {
    try {
      const {
        name
      } = req.params;
      const formulaUsingAttribute = await ScoringFormula.findOne({
        attributeName: name
      });
      if (formulaUsingAttribute) {
        return res.status(400).json({
          message: "Không thể xóa thuộc tính vì đang được sử dụng trong công thức điểm."
        });
      }
      const attribute = await Attribute.findOneAndDelete({
        name
      });
      if (!attribute) {
        return res.status(404).json({
          message: "Attribute not found"
        });
      }
      res.status(200).json({
        message: "Attribute deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
};
module.exports = attributeController;