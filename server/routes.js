var _ = require('lodash');
var Converter = require('csvtojson').Converter;
var fs = require('fs');
var moment = require('moment');
var path = require('path');
var querystring = require('querystring');
var url = require('url');


var _filterTransactions = function(transactions, start, end) {
  // if no start or end date, no filtering is done
  if (!start || !end) { return transactions; }

  var startDate = new Date(start);
  var endDate = new Date(end);
  // console.log('[routes] startDate: ', startDate);
  // console.log('[routes] endDate: ', endDate);
  return _.map(transactions, function(transactionObj, idx) {
    transactionObj.values = _.filter(transactionObj.values, function(valueObj) {
      var date = new Date(valueObj.date);
      // console.log('[routes] date: ', date);
      return (date >= startDate && date <= endDate);
    });
    return transactionObj;
  });
};

module.exports = function(app) {
  var sendIndex = (req, res) => {
    res.sendFile(path.join(__dirname, '/../web/app/index.html'));
  }

  app.get('/', sendIndex);
  app.get('/finances', sendIndex);
  app.get('/running', sendIndex);
}
