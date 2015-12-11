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

  app.get('/mint/chart/transactions', (req, res) => {
    let query = req.query;

    // transactions = {
    //   key: (string)
    //   values: (array)
    // }
    fs.readFile(__dirname + '/../data/transactions_by_category.json', (err, transactions) => {
      // console.log('[mintApi] transactions: ', transactions);
      if (err) {
        console.log('[mintApi] err: ', err);
        throw err;
      }
      let parsedTransactions = JSON.parse(transactions);
      let filteredTransactions = _filterTransactions(parsedTransactions, query.start, query.end);
      res.send(filteredTransactions);
    });
  });

  app.get('/mint/refreshAccounts', (req, res) => {
    console.log('[mintApi] refreshing accounts');
    mint.refreshAccounts();
  });

  app.get('/mint/transactions', (req, res) => {
    console.log('[mintApi] req.query: ', req.query);
    mint.getJsonTransactions(req.query)
      .then((transactions) => {
        res.send(transactions);
      });
  });

  app.get('/mint/chart/transactions', (req, res) => {
    if (!mint || !mint.transactions) {
      res.send([]);
    };

    // filter transactions
    let transactions = mint.transactions;
    if (req && req.query) {
      let query = req.query;
      transactions = _.filter(transactions, (transaction) => {
        let shouldInclude = true;
          if (query.category) {
            shouldInclude = shouldInclude && transaction.Category === query.category;
          };
        return shouldInclude;
      });
    }

    res.send(transactions);
  });

  app.get('/mint/listTransaction', (req, res) => {
    // query category
    mint.listTransaction(req.query)
      .then((transactions) => {
        res.send(transactions);
      })
      .catch((err) => {

      });
  });

  app.get('/mint/categories', (req, res) => {
    mint.getJsonCategories(req.query)
      .then((categories) => {
        res.send(categories);
      })
      .catch((err) => {

      });
  })

  app.get('/mint/getJsonData', (req, res) => {
    mint.getJsonData()
      .then((jsonData) => {
        res.send(jsonData);
      })
      .catch((err) => {
        // console.log('[mintApi] err: ', err);
      });
  });

}
