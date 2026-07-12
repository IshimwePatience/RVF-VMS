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

exports.getSystemSettings = async (req, res) => {
  try {
    const { SystemSetting } = require('../models');
    const settings = await SystemSetting.findAll();
    const settingsObj = {};
    settings.forEach(s => settingsObj[s.key] = s.value);
    res.json(settingsObj);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSystemSetting = async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  try {
    const { SystemSetting } = require('../models');
    let setting = await SystemSetting.findOne({ where: { key } });
    if (setting) {
      setting.value = value;
      await setting.save();
    } else {
      setting = await SystemSetting.create({ key, value });
    }
    res.json(setting);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message || 'Server error' });
  }
};
