import request from 'supertest';

// Use Jest's unstable ESM mock/import flow to ensure test env is set before app loads
beforeAll(() => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret';
  process.env.NODE_ENV = 'test';
});

let app;
beforeAll(async () => {
  // Import app after ensuring test env
  const imported = await import('../src/app.js');
  app = imported.default;
});

describe('GET /api/health', () => {
  test('responds with 200 and status OK (test mode)', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'OK');
    expect(res.body).toHaveProperty('database');
  });
});
