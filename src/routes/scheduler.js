const express = require('express');
const { addScheduledPost, listScheduledPosts } = require('../scheduler/postScheduler');

const router = express.Router();

// GET /api/scheduler — لیست پست‌های زمان‌بندی شده
router.get('/', (req, res) => {
  res.json({ success: true, data: listScheduledPosts() });
});

// POST /api/scheduler — زمان‌بندی پست جدید
// Body: { message, link?, cronExpression }
// Example cronExpression: "0 10 * * 1" = هر دوشنبه ساعت ۱۰
router.post('/', (req, res) => {
  const { message, link, cronExpression } = req.body;

  if (!message || !cronExpression) {
    return res.status(400).json({
      success: false,
      error: 'message and cronExpression are required',
    });
  }

  const result = addScheduledPost({ message, link, cronExpression });
  res.status(201).json({ success: true, data: result });
});

module.exports = router;
