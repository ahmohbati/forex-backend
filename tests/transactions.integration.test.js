import request from 'supertest';
import jwt from 'jsonwebtoken';

import { createToken, setupAppWithMocks } from './utils/testUtils.js';

beforeAll(() => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret';
  process.env.NODE_ENV = 'test';
});

describe('Transactions API (mocked models)', () => {
  let app;
  let mocks;

  beforeAll(async () => {
    const setup = await setupAppWithMocks();
    app = setup.app;
    mocks = setup.mocks;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/transactions returns user transactions', async () => {
    const sample = [
      { id: 1, userId: 1, fromCurrency: 'USD', toCurrency: 'ETB', amount: 10 },
      { id: 2, userId: 1, fromCurrency: 'EUR', toCurrency: 'ETB', amount: 5 }
    ];

    mocks.Transaction.findAll.mockResolvedValue(sample);

    const token = createToken({ userId: 1, email: 'test@example.com' });

    const res = await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(mocks.Transaction.findAll).toHaveBeenCalled();
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toHaveProperty('id', 1);
  });

  test('GET /api/transactions returns empty array when user has no transactions', async () => {
    mocks.Transaction.findAll.mockResolvedValue([]);
    const token = createToken({ userId: 42, email: 'noone@example.com' });

    const res = await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(mocks.Transaction.findAll).toHaveBeenCalled();
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(0);
  });

  test('POST /api/transactions returns 404 when exchange rate not found', async () => {
    mocks.ExchangeRate.findOne.mockResolvedValue(null);
    mocks.Transaction.create.mockImplementation(async (p) => ({ id: 1, ...p }));

    const token = createToken({ userId: 7, email: 'bob@example.com' });

    const payload = { fromCurrency: 'ETB', toCurrency: 'ZZZ', amount: 10 };

    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(404);

    expect(mocks.ExchangeRate.findOne).toHaveBeenCalled();
    expect(mocks.Transaction.create).not.toHaveBeenCalled();
    expect(res.body).toHaveProperty('error', 'Exchange rate not found');
  });

  test('POST /api/transactions creates a new transaction using mocked ExchangeRate', async () => {
    mocks.ExchangeRate.findOne.mockResolvedValue({ rate: '2' });
    mocks.Transaction.create.mockImplementation(async (payload) => ({ id: 99, ...payload }));

    const token = createToken({ userId: 7, email: 'bob@example.com' });

    const payload = { fromCurrency: 'ETB', toCurrency: 'USD', amount: 50, type: 'CONVERT' };

    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(201);

    expect(mocks.ExchangeRate.findOne).toHaveBeenCalledWith(expect.objectContaining({ where: expect.any(Object), order: expect.any(Array) }));
    expect(mocks.Transaction.create).toHaveBeenCalled();
    expect(res.body).toHaveProperty('message');
    expect(res.body.transaction).toHaveProperty('id', 99);
    expect(res.body.transaction).toHaveProperty('userId', 7);
  });
});
