const request = require('supertest');
const app = require('../src/app');
const fb = require('../src/services/facebookService');

jest.mock('../src/services/facebookService');

describe('GET /api/comments/:postId', () => {
  it('returns comments for a post', async () => {
    fb.getComments.mockResolvedValue({ data: [{ id: 'c1', message: 'Nice!' }] });
    const res = await request(app).get('/api/comments/123_456');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('POST /api/comments/:commentId/reply', () => {
  it('returns 400 when message is missing', async () => {
    const res = await request(app)
      .post('/api/comments/c1/reply')
      .send({});
    expect(res.status).toBe(400);
  });

  it('replies to a comment', async () => {
    fb.replyToComment.mockResolvedValue({ id: 'r1' });
    const res = await request(app)
      .post('/api/comments/c1/reply')
      .send({ message: 'Thank you!' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });
});

describe('DELETE /api/comments/:commentId', () => {
  it('deletes a comment', async () => {
    fb.deleteComment.mockResolvedValue({ success: true });
    const res = await request(app).delete('/api/comments/c1');
    expect(res.status).toBe(200);
  });
});
