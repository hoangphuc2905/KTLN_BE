const Attribute = require("../models/Attribute");

const attributeController = {
  // createAttribute: async (req, res) => {
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

  getAttributeByYear: async (req, res) => {
    try {
      const attributes = await Attribute.find({ year: req.params.year });
      if (attributes.length === 0) {
        return res.status(404).json({ message: "Attributes not found" });
      }
      res.status(200).json(attributes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateAttributeByYear: async (req, res) => {
    try {
      const attribute = await Attribute.findOneAndUpdate(
        { year: req.params.year },
        req.body,
        { new: true, runValidators: true }
      );
      if (!attribute) {
        return res.status(404).json({ message: "Attribute not found" });
      }
      res.status(200).json(attribute);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteAttributeByYear: async (req, res) => {
    try {
      const attribute = await Attribute.findOneAndDelete({
        year: req.params.year,
      });
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
