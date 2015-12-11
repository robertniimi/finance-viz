'use strict';

var _ = require('lodash');
var Converter = require('csvtojson').Converter;
var fs = require('fs');
var moment = require('moment');
var path = require('path');

var categorySchema = require('../data/category_schema');

const EXCLUDE_TRANSACTION_TYPES = [
  'Income',
  'Gifts & Donations',
  'Hide from Budgets & Trends',
  'Pets',
  'Kids',
  'Taxes',
  'Transfer'
];

// Normalizes date data to start of month
var _normalizeDate = function(transactions) {
  return _.map(transactions, function(transaction) {
    transaction.Date = moment(new Date(transaction.Date)).startOf('month').toJSON();
    return transaction;
  });
}

var _getDefaultDataValues = function(transactions) {
  var maxDateString = _.max(transactions, function(transaction) {
    return moment(new Date(transaction.Date));
  }).Date;

  var minDateString = _.min(transactions, function(transaction) {
    return moment(new Date(transaction.Date));
  }).Date;

  var maxDate = moment(new Date(maxDateString)).startOf('month');
  var minDate = moment(new Date(minDateString)).startOf('month');

  var defaultValues = [];
  for (var i = minDate; i <= maxDate; i.add(1, 'month')) {
    defaultValues.push({
      date: i.toJSON(),
      amount: 0
    });
  }
  return defaultValues;
}

var _groupByCategory = function(transactions) {
  var defaultValues = _getDefaultDataValues(transactions);
  // create default data obj
  var data = _.map(categorySchema, function(subCategories, category) {
    return {
      key: category,
      values: _.cloneDeep(defaultValues)
    }
  });

  // transaction = {
  //   'Date': (date string),
  //   'Description': (string),
  //   'Original Description': (string),
  //   'Amount': (number),
  //   'Transaction Type': (string),
  //   'Category': (string),
  //   'Account Name': (string),
  //   'Labels': (string),
  //   'Notes': (string)
  // }
  _.forEach(transactions, function(transaction, idx) {
    // find category data object from transaction key (either category key or subcategory of that key)

    // categoryData / categoryObj = {
    //   key: (string)
    //   data: (arrayOf objects)
    // }
    var categoryData = _.find(data, function(categoryObj) {
      var includedCategories = categorySchema[categoryObj.key];
      // console.log('[get_transactions] includedCategories: ', includedCategories);
      // console.log('[get_transactions] transaction.Category: ', transaction.Category);
      return (transaction.Category === categoryObj.key || includedCategories.indexOf(transaction.Category) !== -1);
    });

    if (categoryData) {
      // dataValue = {
      //   date: (date string) ?
      //   amount: (number)
      // }
      var dataValue = _.find(categoryData.values, function(valueObj) {
        // if transaction date is the same as the data value date then add the value to the data obj amount
        return valueObj.date === transaction.Date;
      });

      if (dataValue) {
        //
        dataValue.amount += transaction.Amount;
      } else {
        throw ('[get_transactions] @_groupByCategory: dataValue object not found');
      }

    } else {
      throw ('[get_transactions] @_groupByCategory: categoryData object not found');
    }
  });

  _.remove(data, function(dataObj) {
    return (EXCLUDE_TRANSACTION_TYPES.indexOf(dataObj.key) !== -1);
  });

  return data;
}

// var getTransactions = function(dateRange) {}
// module.exports = getTransactions();

module.exports = function() {
  var fileStream = fs.createReadStream(__dirname + '/../data/transactions.csv');
  var converter = new Converter();

  // var minDate, maxDate;
  converter.on('end_parsed', function(JSONTrans) {
    // console.log('[generate_transaction_json] JSONTrans: ', JSONTrans);

    // Normalize the date by start of month
    var formattedTrans = _normalizeDate(JSONTrans);
    // Generate Data Grouped by Category
    var data = _groupByCategory(formattedTrans);

    let path = __dirname + '/../data/transactions_by_category.json';

    fs.writeFile(path, JSON.stringify(data), function(err) {
      if (err) { throw (err); }
      console.log(`[get_transactions.js] saved ${ path }`);
    });
  });

  fileStream.pipe(converter);
};
