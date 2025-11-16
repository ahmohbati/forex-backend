import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../src/middleware/auth.js';

// Ensure JWT secret for tests
beforeAll(() => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret';
});

describe('Authenticated endpoints (middleware)', () => {
  let testApp;

  beforeAll(() => {
    // Create a lightweight express app to test the middleware in isolation
    testApp = express();
    testApp.get('/__test_protected', authenticateToken, (req, res) => {
      res.json({ userId: req.userId, email: req.userEmail });
    });
  });

  test('returns 401 when no token provided', async () => {
    const res = await request(testApp).get('/__test_protected');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error', 'Access token required');
  });

  test('returns 403 when token is invalid', async () => {
    const res = await request(testApp)
      .get('/__test_protected')
      .set('Authorization', 'Bearer invalid.token.here');

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('error');
  });

  test('allows access with a valid token and exposes user info', async () => {
    const payload = { userId: 123, email: 'tester@example.com' };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    const res = await request(testApp)
      .get('/__test_protected')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ userId: 123, email: 'tester@example.com' });
  });
});
