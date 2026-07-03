const { ExchangeRate } = require('../models');

exports.getExchangeRates = async (req, res) => {
  try {
    const rates = await ExchangeRate.findAll();
    res.json(rates);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateExchangeRate = async (req, res) => {
  const { currency } = req.params;
  const { rate_to_rwf } = req.body;

  try {
    let exchangeRate = await ExchangeRate.findOne({ where: { currency } });
    if (exchangeRate) {
      exchangeRate.rate_to_rwf = rate_to_rwf;
      await exchangeRate.save();
    } else {
      exchangeRate = await ExchangeRate.create({ currency, rate_to_rwf });
    }
    res.json(exchangeRate);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Server error' });
  }
};
