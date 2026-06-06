const request = require('supertest');
const app = require('../src/app');
const fb = require('../src/services/facebookService');

jest.mock('../src/services/facebookService');

describe('POST /api/posts', () => {
  it('returns 400 when message is missing', async () => {
    const res = await request(app).post('/api/posts').send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('publishes a post successfully', async () => {
    fb.publishPost.mockResolvedValue({ id: '123_456' });
    const res = await request(app)
      .post('/api/posts')
      .send({ message: 'Hello World' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe('123_456');
  });
});

describe('GET /api/posts', () => {
  it('returns list of posts', async () => {
    fb.getPosts.mockResolvedValue({ data: [{ id: '1', message: 'Test' }] });
    const res = await request(app).get('/api/posts');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('DELETE /api/posts/:postId', () => {
  it('deletes a post', async () => {
    fb.deletePost.mockResolvedValue({ success: true });
    const res = await request(app).delete('/api/posts/123_456');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
