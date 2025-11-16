import sequelize from './index.js';
import User from './User.js';
import Currency from './Currency.js';
import ExchangeRate from './ExchangeRate.js';
import Transaction from './Transaction.js';
import setupAssociations from './associations.js';

const initDatabase = async () => {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Setup associations first
    setupAssociations();

    // Sync all models
    await sequelize.sync({ force: false });
    console.log('✅ Database synchronized successfully.');

    // Insert sample data
    await insertSampleData();
    
    console.log('✅ Database initialization completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Unable to initialize database:', error);
    process.exit(1);
  }
};

const insertSampleData = async () => {
  try {
    // Check if data already exists to avoid duplicates
    const existingCurrencies = await Currency.count();
    if (existingCurrencies > 0) {
      console.log('✅ Sample data already exists, skipping...');
      return;
    }

    // Insert currencies with ETB as primary
    const currencies = [
      { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br', isActive: true },
      { code: 'USD', name: 'US Dollar', symbol: '$', isActive: true },
      { code: 'EUR', name: 'Euro', symbol: '€', isActive: true },
      { code: 'GBP', name: 'British Pound', symbol: '£', isActive: true },
      { code: 'JPY', name: 'Japanese Yen', symbol: '¥', isActive: true },
      { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', isActive: true },
      { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', isActive: true },
      { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', isActive: true },
      { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', isActive: true },
      { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', isActive: true }
    ];

    for (const currencyData of currencies) {
      await Currency.findOrCreate({
        where: { code: currencyData.code },
        defaults: currencyData
      });
    }
    console.log('✅ Currencies inserted');

    // Current approximate exchange rates (ETB as base)
    const exchangeRates = [
      // ETB to other currencies
      { baseCurrency: 'ETB', targetCurrency: 'USD', rate: 0.0066 },
      { baseCurrency: 'ETB', targetCurrency: 'EUR', rate: 0.0057 },
      { baseCurrency: 'ETB', targetCurrency: 'GBP', rate: 0.0052 },
      { baseCurrency: 'ETB', targetCurrency: 'JPY', rate: 1.0065 },
      { baseCurrency: 'ETB', targetCurrency: 'CAD', rate: 0.0091 },
      { baseCurrency: 'ETB', targetCurrency: 'AED', rate: 0.024 },
      { baseCurrency: 'ETB', targetCurrency: 'CNY', rate: 0.046 },
      { baseCurrency: 'ETB', targetCurrency: 'SAR', rate: 0.024 },
      { baseCurrency: 'ETB', targetCurrency: 'KES', rate: 0.83 },
      
      // Reverse rates (other currencies to ETB)
      { baseCurrency: 'USD', targetCurrency: 'ETB', rate: 150.5286 },
      { baseCurrency: 'EUR', targetCurrency: 'ETB', rate: 174.2369},
      { baseCurrency: 'GBP', targetCurrency: 'ETB', rate: 194.0159},
      { baseCurrency: 'JPY', targetCurrency: 'ETB', rate: 0.9935 },
      { baseCurrency: 'CAD', targetCurrency: 'ETB', rate: 110.36 },
      { baseCurrency: 'AED', targetCurrency: 'ETB', rate: 42.16 },
      { baseCurrency: 'CNY', targetCurrency: 'ETB', rate: 21.77},
      { baseCurrency: 'SAR', targetCurrency: 'ETB', rate: 41.30 },
      { baseCurrency: 'KES', targetCurrency: 'ETB', rate: 1.20 }
    ];

    for (const rateData of exchangeRates) {
      await ExchangeRate.create(rateData);
    }
    console.log('✅ Exchange rates inserted');

  } catch (error) {
    console.error('Error inserting sample data:', error);
  }
};

// Run initialization if called directly
import path from 'path';
const isMainInit = process.argv[1] && path.basename(process.argv[1]) === 'init.js' && process.argv[1].includes(`${path.sep}models${path.sep}`);
if (isMainInit) {
  initDatabase();
}

export default initDatabase;