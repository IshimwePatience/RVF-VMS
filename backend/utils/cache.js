const NodeCache = require("node-cache");
const sessionCache = new NodeCache({ stdTTL: 86400 }); // 24 hours
const otpCache = new NodeCache({ stdTTL: 300 }); // 5 minutes

module.exports = {
  sessionCache,
  otpCache
};
