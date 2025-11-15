import express from 'express';
import Transaction from '../models/Transaction.js';
import ExchangeRate from '../models/ExchangeRate.js';
import Currency from '../models/Currency.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user transactions
router.get('/', authenticateToken, async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { userId: req.userId },
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Currency,
          as: 'fromCurrencyDetail',
          attributes: ['name']
        },
        {
          model: Currency,
          as: 'toCurrencyDetail',
          attributes: ['name']
        }
      ]
    });
    
    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Create transaction
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { fromCurrency, toCurrency, amount, type = 'CONVERT' } = req.body;

    // Get latest exchange rate
    const latestRate = await ExchangeRate.findOne({
      where: { 
        baseCurrency: fromCurrency, 
        targetCurrency: toCurrency 
      },
      order: [['timestamp', 'DESC']]
    });

    if (!latestRate) {
      return res.status(404).json({ error: 'Exchange rate not found' });
    }

    const exchangeRate = parseFloat(latestRate.rate);
    const convertedAmount = parseFloat(amount) * exchangeRate;
    const fee = convertedAmount * 0.01;
    const finalAmount = convertedAmount - fee;

    // Create transaction
    const transaction = await Transaction.create({
      userId: req.userId,
      fromCurrency,
      toCurrency,
      amount: parseFloat(amount),
      exchangeRate,
      convertedAmount: finalAmount,
      fee,
      type
    });

    res.status(201).json({
      message: 'Transaction completed successfully',
      transaction
    });

  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Transaction failed' });
  }
});

export default router;