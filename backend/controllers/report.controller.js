const reportService = require('../services/report.service');

exports.getFinancialReport = async (req, res) => {
  try {
    const report = await reportService.getFinancialReport(req.user);
    res.json(report);
  } catch (error) {
    res.status(403).json({ message: error.message || 'Server error' });
  }
};