const WorkUnit = require("../models/WorkUnit");

const workUnitController = {
  createWorkUnit: async (req, res) => {
    try {
      const workUnit = new WorkUnit(req.body);
      await workUnit.save();
      res.status(201).json(workUnit);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getAllWorkUnits: async (req, res) => {
    try {
      const workUnits = await WorkUnit.find();
      res.status(200).json(workUnits);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getWorkUnitById: async (req, res) => {
    try {
      const workUnit = await WorkUnit.findOne({
        work_unit_id: req.params.work_unit_id,
      });
      if (!workUnit) {
        return res.status(404).json({ message: "WorkUnit not found" });
      }
      res.status(200).json(workUnit);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateWorkUnitById: async (req, res) => {
    try {
      const workUnit = await WorkUnit.findOneAndUpdate(
        { work_unit_id: req.params.work_unit_id },
        req.body,
        { new: true, runValidators: true }
      );
      if (!workUnit) {
        return res.status(404).json({ message: "WorkUnit not found" });
      }
      res.status(200).json(workUnit);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = workUnitController;
