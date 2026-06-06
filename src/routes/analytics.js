const express = require('express');
const fb = require('../services/facebookService');

const router = express.Router();

// GET /api/analytics/page — اطلاعات کلی صفحه
router.get('/page', async (req, res, next) => {
  try {
    const data = await fb.getPageInfo();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// GET /api/analytics/insights — آمار و بینش‌های صفحه
// Query params: period (day|week|month), since, until
router.get('/insights', async (req, res, next) => {
  try {
    const { period = 'day', since, until } = req.query;

    const allowed = ['day', 'week', 'month'];
    if (!allowed.includes(period)) {
      return res.status(400).json({
        success: false,
        error: `period must be one of: ${allowed.join(', ')}`,
      });
    }

    const data = await fb.getPageInsights(period, since, until);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
