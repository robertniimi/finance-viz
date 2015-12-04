'use strict';

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

module.exports = (app, mint) => {
  // app.get('/', (req, res) => {
  //   res.sendFile(path.join(__dirname, '/../web/app/index.html'));
  // });

  app.get('/mint/transactions', (req, res) => {
    console.log('[mintApi] getting transactions');
    var urlParts = url.parse(req.url);
    var query = querystring.parse(urlParts.query);

    // console.log('[routes] query: ', query);

    // transactions = {
    //   key: (string)
    //   values: (array)
    // }
    fs.readFile(__dirname + '/../data/transactions_by_category.json', (err, transactions) => {
      if (err) { throw err; }
      var parsedTransactions = JSON.parse(transactions);
      var filteredTransactions = _filterTransactions(parsedTransactions, query.start, query.end);
      res.send(filteredTransactions);
    });
  });

  app.get('/mint/refreshAccounts', (req, res) => {
    console.log('[mintApi] refreshing accounts');
    // console.log('[mintApi.refreshAccounts] req.body: ', req.body);
    console.log('[mintApi] refreshing accounts');
    mint.refreshAccounts();
  });

  app.get('/mint/getJsonData', (req, res) => {
    mint.getJsonData()
      .then((jsonData) => {
        // console.log('[mintApi] jsonData: ', jsonData);
        res.send(jsonData);
      })
      .catch((err) => {
        // console.log('[mintApi] err: ', err);
      });
  });

}
