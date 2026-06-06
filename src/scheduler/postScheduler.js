const cron = require('node-cron');
const fb = require('../services/facebookService');

// صف پست‌های برنامه‌ریزی شده (در محیط production از DB استفاده کنید)
const scheduledPosts = [];

function addScheduledPost({ message, link, cronExpression, runOnce = true }) {
  const task = cron.schedule(
    cronExpression,
    async () => {
      try {
        const result = await fb.publishPost({ message, link });
        console.log(`[Scheduler] Post published: ${result.id}`);
        if (runOnce) task.stop();
      } catch (err) {
        console.error(`[Scheduler] Failed to publish post: ${err.message}`);
      }
    },
    { timezone: 'Asia/Tehran' }
  );

  scheduledPosts.push({ message, cronExpression, task });
  return { queued: true, cronExpression };
}

function listScheduledPosts() {
  return scheduledPosts.map(({ message, cronExpression }) => ({
    message,
    cronExpression,
  }));
}

module.exports = { addScheduledPost, listScheduledPosts };
