const request = require('request');

module.exports = {
  authenticateStrava() {
    return request.get('/strava/auth');
  },
};
