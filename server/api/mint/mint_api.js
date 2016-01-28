'use strict';

var _ = require('lodash');
var Converter = require('csvtojson').Converter;
var fs = require('fs');
var moment = require('moment');
var path = require('path');
var querystring = require('querystring');
var url = require('url');

// Endpoints
var trendData = require('./mint_api_trend_data');
var getJson = require('./mint_api_get_json');

var _filterTransactions = function(transactions, query) {
  // Filter by date range
  if (query.start && query.end) {
    var startDate = new Date(query.start);
    var endDate = new Date(query.end);
    transactions = _.map(transactions, function(transactionObj, idx) {
      transactionObj.values = _.filter(transactionObj.values, function(valueObj) {
        var date = new Date(valueObj.date);
        // console.log('[routes] date: ', date);
        return (date >= startDate && date <= endDate);
      });
      return transactionObj;
    });
  }

  // Filter by query
  if (query.query) {

  };

  return transactions;
};

module.exports = (app, mint) => {
  trendData(app, mint);
  getJson(app, mint);

  app.get('/mint/chart/transactions', (req, res) => {
    let query = req.query;

    // transactions = {
    //   key: (string)
    //   values: (array)
    // }
    fs.readFile(__dirname + '/../../data/transactions_by_category.json', (err, transactions) => {
      // console.log('[mintApi] transactions: ', transactions);
      if (err) {
        console.log('[mintApi] err: ', err);
        throw err;
      }
      let parsedTransactions = JSON.parse(transactions);
      let filteredTransactions = _filterTransactions(parsedTransactions, query);
      res.send(filteredTransactions);
    });
  });


  app.get('/mint/chart/transactions', (req, res) => {
    console.log('[mintApi] @mint/chart/transactions');
    if (!mint || !mint.transactions) {

      res.send([]);
    };

    // filter transactions
    let transactions = mint.transactions;
    if (req && req.query) {
      if (req.query.to && req.query.from) {
        transactions = _filterTransactions(transactions, query.start, query.end);
      }
    }

    res.send(transactions);
  });

  app.get('/mint/accounts', (req, res) => {
    let service = 'MintAccountService';
    let task = 'getAccountsSortedByBalanceDescending';
    let id = 'accounts';
    let args = {
      types: [
        'BANK',
        'CREDIT',
        'INVESTMENT',
        'LOAN',
        'MORTGAGE',
        'OTHER_PROPERTY',
        'REAL_ESTATE',
        'VEHICLE',
        'UNCLASSIFIED',
      ],
    };

    mint.bundledServiceController(service, task, id, args)
      .then((data) => {
        res.send(data);
      })
  });

  app.get('/mint/refreshAccounts', (req, res) => {
    // console.log('[mintApi] refreshing accounts');
    mint.refreshAccounts();
  });

  app.post('/mint/transactions', (req, res) => {
    // console.log('[mintApi] @POST: transaction -> req.body.transaction: ', req.body.transaction);
    // console.log('[mintApi] @POST: category -> req.body.category: ', req.body.category);
    mint.updateTransaction(req.body.transaction, req.body.category)
      .then((result) => {
        res.send(result);
      });
  })

  app.get('/mint/listTransaction', (req, res) => {
    // query category
    mint.listTransaction(req.query)
      .then((transactions) => {
        res.send(transactions);
      })
      .catch((err) => {
        res.send(error);
      });
  });


  app.get('/mint/autosuggestFilter', (req, res) => {
    mint.autosuggestFilter()
      .then((suggestions) => {
        res.send(suggestions);
      })
      .catch((err) => {

      })
  })

}
