const Department = require("../models/Department");
const departmentController = {
  createDepartment: async (req, res) => {
    try {
      const {
        department_name,
        roles
      } = req.body;
      if (roles && !Array.isArray(roles)) {
        return res.status(400).json({
          message: "Roles must be an array"
        });
      }
      const department = new Department({
        department_name,
        roles
      });
      await department.save();
      res.status(201).json(department);
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  },
  getAllDepartments: async (req, res) => {
    try {
      const departments = await Department.find().populate("roles");
      res.status(200).json(departments);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
  getDepartmentById: async (req, res) => {
    try {
      const department = await Department.findById(req.params.id).populate("roles");
      if (!department) {
        return res.status(404).json({
          message: "Department not found"
        });
      }
      res.status(200).json(department);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
  updateDepartmentById: async (req, res) => {
    try {
      const {
        department_name,
        roles
      } = req.body;

      // Validate roles as an array of ObjectIds
      if (roles && !Array.isArray(roles)) {
        return res.status(400).json({
          message: "Roles must be an array"
        });
      }
      const department = await Department.findByIdAndUpdate(req.params.id, {
        department_name,
        roles
      }, {
        new: true,
        runValidators: true
      });
      if (!department) {
        return res.status(404).json({
          message: "Department not found"
        });
      }
      res.status(200).json(department);
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  },
  deleteDepartmentById: async (req, res) => {
    try {
      const department = await Department.findByIdAndDelete(req.params.id);
      if (!department) {
        return res.status(404).json({
          message: "Department not found"
        });
      }
      res.status(200).json({
        message: "Department deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
};
module.exports = departmentController;