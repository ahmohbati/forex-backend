import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id'
  },
  fromCurrency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: 'from_currency'
  },
  toCurrency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: 'to_currency'
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  exchangeRate: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: false,
    field: 'exchange_rate'
  },
  convertedAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'converted_amount'
  },
  fee: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  type: {
    type: DataTypes.ENUM('BUY', 'SELL', 'CONVERT'),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'COMPLETED'
  }
}, {
  tableName: 'transactions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

export default Transaction;