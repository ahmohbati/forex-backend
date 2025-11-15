import User from './User.js';
import Currency from './Currency.js';
import ExchangeRate from './ExchangeRate.js';
import Transaction from './Transaction.js';

// Define all associations
const setupAssociations = () => {
  // User-Transaction association
  User.hasMany(Transaction, {
    foreignKey: 'user_id',
    as: 'transactions'
  });
  
  Transaction.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
  });

  // Currency associations for transactions
  Transaction.belongsTo(Currency, {
    foreignKey: 'from_currency',
    targetKey: 'code',
    as: 'fromCurrencyDetail'
  });

  Transaction.belongsTo(Currency, {
    foreignKey: 'to_currency',
    targetKey: 'code',
    as: 'toCurrencyDetail'
  });

  // Exchange rate associations
  ExchangeRate.belongsTo(Currency, {
    foreignKey: 'base_currency',
    targetKey: 'code',
    as: 'baseCurrencyDetail'
  });

  ExchangeRate.belongsTo(Currency, {
    foreignKey: 'target_currency',
    targetKey: 'code',
    as: 'targetCurrencyDetail'
  });
};

export default setupAssociations;