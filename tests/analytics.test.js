const request = require('supertest');
const app = require('../src/app');
const fb = require('../src/services/facebookService');

jest.mock('../src/services/facebookService');

describe('GET /api/analytics/page', () => {
  it('returns page info', async () => {
    fb.getPageInfo.mockResolvedValue({ id: '111', name: 'My Shop', fan_count: 5000 });
    const res = await request(app).get('/api/analytics/page');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('GET /api/analytics/insights', () => {
  it('returns insights for valid period', async () => {
    fb.getPageInsights.mockResolvedValue({ data: [] });
    const res = await request(app).get('/api/analytics/insights?period=week');
    expect(res.status).toBe(200);
  });

  it('returns 400 for invalid period', async () => {
    const res = await request(app).get('/api/analytics/insights?period=year');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
