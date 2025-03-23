const Role = require("../models/Role");

const roleController = {
  createRole: async (req, res) => {
    try {
      const role = new Role(req.body);
      await role.save();
      res.status(201).json(role);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getAllRoles: async (req, res) => {
    try {
      const roles = await Role.find();
      res.status(200).json(roles);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getRoleById: async (req, res) => {
    try {
      const role = await Role.findById(req.params.id);
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }
      res.status(200).json(role);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateRoleById: async (req, res) => {
    try {
      const role = await Role.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }
      res.status(200).json(role);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteRoleById: async (req, res) => {
    try {
      const role = await Role.findByIdAndDelete(req.params.id);
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }
      res.status(200).json({ message: "Role deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = roleController;
