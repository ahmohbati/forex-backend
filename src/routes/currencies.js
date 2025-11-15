import express from 'express';
import Currency from '../models/Currency.js';
import ExchangeRate from '../models/ExchangeRate.js';

const router = express.Router();

// Get all currencies (ETB first)
router.get('/', async (req, res) => {
  try {
    const currencies = await Currency.findAll({
      where: { isActive: true },
      order: [
        ['code', 'ASC'] // This will show ETB first alphabetically
      ],
      attributes: ['id', 'code', 'name', 'symbol']
    });
    
    // Reorder to put ETB first
    const etbCurrency = currencies.find(c => c.code === 'ETB');
    const otherCurrencies = currencies.filter(c => c.code !== 'ETB');
    const sortedCurrencies = etbCurrency ? [etbCurrency, ...otherCurrencies] : currencies;
    
    res.json(sortedCurrencies);
  } catch (error) {
    console.error('Get currencies error:', error);
    res.status(500).json({ error: 'Failed to fetch currencies' });
  }
});

// Get exchange rates (default base: ETB)
router.get('/rates', async (req, res) => {
  try {
    const { base = 'ETB' } = req.query;
    
    const rates = await ExchangeRate.findAll({
      where: { baseCurrency: base },
      order: [['timestamp', 'DESC']],
      limit: 15,
      include: [
        {
          model: Currency,
          as: 'baseCurrencyDetail',
          attributes: ['name']
        },
        {
          model: Currency,
          as: 'targetCurrencyDetail',
          attributes: ['name']
        }
      ]
    });
    
    res.json(rates);
  } catch (error) {
    console.error('Get rates error:', error);
    res.status(500).json({ error: 'Failed to fetch exchange rates' });
  }
});

// Convert currency (default from: ETB)
router.post('/convert', async (req, res) => {
  try {
    const { amount, fromCurrency = 'ETB', toCurrency } = req.body;

    if (!amount || !toCurrency) {
      return res.status(400).json({ error: 'Amount and toCurrency are required' });
    }

    // Get latest exchange rate
    const latestRate = await ExchangeRate.findOne({
      where: { 
        baseCurrency: fromCurrency, 
        targetCurrency: toCurrency 
      },
      order: [['timestamp', 'DESC']]
    });

    if (!latestRate) {
      return res.status(404).json({ error: 'Exchange rate not found for the selected currency pair' });
    }

    const exchangeRate = parseFloat(latestRate.rate);
    const convertedAmount = parseFloat(amount) * exchangeRate;
    const fee = convertedAmount * 0.01; // 1% fee
    const finalAmount = convertedAmount - fee;

    res.json({
      originalAmount: parseFloat(amount),
      convertedAmount: finalAmount,
      exchangeRate,
      fee,
      fromCurrency,
      toCurrency,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Convert error:', error);
    res.status(500).json({ error: 'Conversion failed' });
  }
});

// Get popular ETB exchange rates (for dashboard)
router.get('/popular-rates', async (req, res) => {
  try {
    const popularCurrencies = ['USD', 'EUR', 'GBP', 'AED', 'CNY', 'SAR'];
    
    const rates = await ExchangeRate.findAll({
      where: { 
        baseCurrency: 'ETB',
        targetCurrency: popularCurrencies
      },
      order: [['timestamp', 'DESC']],
      include: [
        {
          model: Currency,
          as: 'targetCurrencyDetail',
          attributes: ['name', 'symbol']
        }
      ]
    });

    // Get the latest rate for each currency
    const latestRates = {};
    rates.forEach(rate => {
      if (!latestRates[rate.targetCurrency] || new Date(rate.timestamp) > new Date(latestRates[rate.targetCurrency].timestamp)) {
        latestRates[rate.targetCurrency] = rate;
      }
    });

    res.json(Object.values(latestRates));
  } catch (error) {
    console.error('Get popular rates error:', error);
    res.status(500).json({ error: 'Failed to fetch popular rates' });
  }
});

export default router;