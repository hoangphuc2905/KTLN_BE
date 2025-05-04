const academicYearController = {
  getAcademicYears: async (req, res) => {
    try {
      const now = new Date();
      const currentYear = now.getFullYear();

      const years = [];
      for (let i = -3; i < 0; i++) {
        const startYear = currentYear + i;
        const endYear = startYear + 1;
        years.push(`${startYear}-${endYear}`);
      }

      res.status(200).json({
        message: "Academic years retrieved successfully",
        academicYears: years,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getDefaultAcademicYear: async (req, res) => {
    try {
      const now = new Date();
      const currentYear = now.getFullYear();
      const startYear = now.getMonth() < 7 ? currentYear - 1 : currentYear;
      const endYear = startYear + 1;
      const defaultAcademicYear = `${startYear}-${endYear}`;

      res.status(200).json({
        message: "Default academic year retrieved successfully",
        academicYear: defaultAcademicYear,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = academicYearController;
