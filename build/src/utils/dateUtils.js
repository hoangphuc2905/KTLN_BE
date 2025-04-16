exports.getAcademicYearRange = academicYear => {
  const [startYear, endYear] = academicYear.split("-").map(Number);
  const startDate = new Date(`${startYear}-08-01T00:00:00.000Z`);
  const endDate = new Date(`${endYear}-07-31T23:59:59.999Z`);
  return {
    startDate,
    endDate
  };
};
exports.getDefaultAcademicYear = () => {
  const now = new Date();
  const currentYear = now.getFullYear();

  // Nếu hiện tại là trước tháng 8, năm học bắt đầu từ năm trước
  const startYear = now.getMonth() < 7 ? currentYear - 1 : currentYear;
  const endYear = startYear + 1;
  return `${startYear}-${endYear}`;
};