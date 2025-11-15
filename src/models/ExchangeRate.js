import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const ExchangeRate = sequelize.define('ExchangeRate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  baseCurrency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: 'base_currency'
  },
  targetCurrency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: 'target_currency'
  },
  rate: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: false
  }
}, {
  tableName: 'exchange_rates',
  timestamps: true,
  createdAt: 'timestamp',
  updatedAt: false,
  indexes: [
    {
      unique: true,
      fields: ['base_currency', 'target_currency', 'timestamp']
    }
  ]
});

export default ExchangeRate;