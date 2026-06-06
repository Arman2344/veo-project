const express = require('express');
const fb = require('../services/facebookService');

const router = express.Router();

// GET /api/comments/:postId — دریافت کامنت‌های یک پست
router.get('/:postId', async (req, res, next) => {
  try {
    const { limit = 25, after } = req.query;
    const data = await fb.getComments(req.params.postId, Number(limit), after);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// POST /api/comments/:commentId/reply — پاسخ به کامنت
router.post('/:commentId/reply', async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: 'message is required' });
    }
    const data = await fb.replyToComment(req.params.commentId, message);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/comments/:commentId — حذف کامنت
router.delete('/:commentId', async (req, res, next) => {
  try {
    const data = await fb.deleteComment(req.params.commentId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/comments/:commentId/hide — مخفی/نمایش کامنت
router.patch('/:commentId/hide', async (req, res, next) => {
  try {
    const { hide = true } = req.body;
    const data = await fb.hideComment(req.params.commentId, hide);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
