import jwt from 'jsonwebtoken';

export const createToken = (payload = { userId: 1, email: 'test@example.com' }, opts = {}) => {
  const secret = process.env.JWT_SECRET || 'test_jwt_secret';
  return jwt.sign(payload, secret, { expiresIn: '1h', ...opts });
};

// Helper to mock model modules and import the app after mocks are registered.
export const setupAppWithMocks = async ({ transactionMock = {}, exchangeRateMock = {}, currencyMock = {} } = {}) => {
  // Provide default jest.fn implementations if missing
  const defaultTransaction = { findAll: jest.fn(), create: jest.fn(), ...transactionMock };
  const defaultExchangeRate = { findOne: jest.fn(), ...exchangeRateMock };
  const defaultCurrency = { ...currencyMock };

  // Import the real models and patch their methods to jest.fn so routes use the mocked functions.
  const transactionModule = await import('../../src/models/Transaction.js');
  const exchangeRateModule = await import('../../src/models/ExchangeRate.js');
  const currencyModule = await import('../../src/models/Currency.js');

  // Overwrite methods on the real model exports
  transactionModule.default.findAll = defaultTransaction.findAll;
  transactionModule.default.create = defaultTransaction.create;

  exchangeRateModule.default.findOne = defaultExchangeRate.findOne;

  // Currency may not need functions for these tests but keep a reference
  // Return the app after models are patched
  const imported = await import('../../src/app.js');
  return { app: imported.default, mocks: { Transaction: transactionModule.default, ExchangeRate: exchangeRateModule.default, Currency: currencyModule.default } };
};
