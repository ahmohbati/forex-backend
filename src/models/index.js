import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// In test environment, if DATABASE_URL is not provided, use an in-memory SQLite
// instance so tests can import models without requiring a real Postgres URL.
let sequelize;
if (process.env.NODE_ENV === 'test' && !process.env.DATABASE_URL) {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false
  });
} else {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
}

export default sequelize;