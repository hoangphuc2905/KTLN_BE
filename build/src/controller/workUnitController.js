const WorkUnit = require("../models/WorkUnit");
const workUnitController = {
  createWorkUnit: async (req, res) => {
    try {
      const workUnit = new WorkUnit(req.body);
      await workUnit.save();
      res.status(201).json(workUnit);
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  },
  getAllWorkUnits: async (req, res) => {
    try {
      const workUnits = await WorkUnit.find();
      res.status(200).json(workUnits);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
  getWorkUnitById: async (req, res) => {
    try {
      const workUnit = await WorkUnit.findOne({
        work_unit_id: req.params.work_unit_id
      });
      if (!workUnit) {
        return res.status(404).json({
          message: "WorkUnit not found"
        });
      }
      res.status(200).json(workUnit);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  },
  updateWorkUnitById: async (req, res) => {
    try {
      const workUnitId = req.params.work_unit_id;
      const updateData = {
        name_vi: req.body.name_vi,
        name_en: req.body.name_en,
        address_vi: req.body.address_vi,
        address_en: req.body.address_en
      };
      const workUnit = await WorkUnit.findOneAndUpdate({
        work_unit_id: workUnitId
      }, updateData, {
        new: true,
        runValidators: true
      });
      if (!workUnit) {
        return res.status(404).json({
          message: "WorkUnit not found"
        });
      }
      res.status(200).json(workUnit);
    } catch (error) {
      console.error("Error in updateWorkUnitById:", error);
      res.status(400).json({
        message: error.message
      });
    }
  }
};
module.exports = workUnitController;