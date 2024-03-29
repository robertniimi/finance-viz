'use strict';

var _ = require('lodash');
var cookieparser = require('cookieparser');
var querystring = require('querystring');
var fs = require('fs');
var Promise = require('bluebird');
var Converter = require('csvtojson').Converter;
var moment = require('moment');

// Utils
var Requester = require('../utils/requester');
var generateTransactionJson = require('../utils/generate_transaction_json');

// Consts
var URLS = require('../constants').URLS;
var HEADERS = require('../constants').HEADERS;
var DATE_RANGES = require('../constants').dateRanges;

class Mint {
  constructor(username, password) {
    this.requester = new Requester();
    this.token = null;
    this.transactions = null;

    this.login = () => {
      let options = {
        form: {
          task: 'L',
          username: username,
          password: password,
        },
      }

      return this.requester.post(URLS.login, options, this);
    }
  }

  // Response
  // ========
  //

  downloadTransactions(path, saveAsJson) {
    let _self = this;
    return this.requester.getFile(path, URLS.transactionDownload)
      .then(() => {
        if (saveAsJson) {
          let fileStream = fs.createReadStream(path);
          let converter = new Converter();
          let newPath = path.replace(/\.csv$/, '.json');

          // var minDate, maxDate;
          converter.on('end_parsed', function(JSONTrans) {
            _self.transactions = JSONTrans;
            fs.writeFile(newPath, JSON.stringify(JSONTrans), function(err) {
              if (err) { throw (err); }
              console.log(`[get_transactions.js] saved ${ path }!`);
            });
          });

          fileStream.pipe(converter);
        }
      })
      .catch((err) => {
        throw new Error('[mint] @downloadTransactions -> ERR: ', err);
      });
  }


  updateTransaction(transaction, category) {
    // console.log('[mint] @updateTransactions -> transaction: ', transaction);
    let date = moment(new Date(transaction.date));
    if (date.year() === 2001) {
      date.year(moment().year());
    };

    let data = {
      task: transaction.task || 'simpleEdit',
      date: date.format('MM/DD/YYYY'),
      merchant: transaction.merchant,
      category: category.value,
      catId: category.id,
      categoryTypeFilter: 'null',
      amount: null,
      token: this.token,
    };

    return this.login()
      .then(() => {
        this.requester.post(URLS.updateTransaction, {
          form: querystring.stringify(data) + `&txnId=${ transaction.id }:${ transaction.txnType }`,
        })
      });
  }

  // Response
  // ========
  //
  // Arguments
  // =========
  // queryObj = {
  //   accountId:0
  //   query:category: Uncategorized
  //   offset:0
  //   comparableType:8
  //   acctChanged:T
  //   task:transactions,txnfilters
  //   rnd:1449293714918
  // }
  getJsonData(queryObj) {
    let query = _.assign(queryObj);
    return this.login()
      .then(() => {
        return this.requester.get(`${ URLS.getJsonData }?${ query }`);
      });
  }

  // Response
  // ========
  //
  getJsonTransactions(queryObj) {
    let query = _.assign({
      accountId: 0,
      offset: 0,
      comparableType: 8,
      acctChanged: 'T',
      task: 'transactions,txnfilters',
      rnd: (new Date()).valueOf(),
    }, queryObj);

    return this.login()
      .then(() => {
        return this.requester.get(`${ URLS.getJsonData }?${ querystring.stringify(query) }`, {
          token: this.token,
        });
      });
  }

  // Response
  // ========
  //
  getJsonCategories() {
    let query = {
      task: 'categories',
      rnd: (new Date()).valueOf(),
    };

    return this.login()
      .then(() => {
        return this.requester.get(`${ URLS.getJsonData }?${ querystring.stringify(query) }`, {
          token: this.token,
        });
      });
  }

  // TODO: Get working
  refreshAccounts() {
    console.log('[mint] refreshAccounts');
    let formData = querystring.stringify({token: this.token});
    this.login()
      .then(() => {
        return this.requester.post(URLS.refreshAccounts, {
          form: formData,
        });
      })
      .then((response) => {
        console.log('[mint] @refreshAccounts -> response: ', response);
        generateTransactionJson();
      })
      .catch((err) => {
        console.log('[client] err: ', err);
      });
  }

  // TODO: Get working
  refreshJob() {
    return this.login()
      .then(() => {
        return this.requester.get(URLS.refreshJob);
      });
  }

  listTransaction(queryObj) {
    let query = _.assign({
      accountId: 0,
      filterType: 'cash',
      queryNew: '',
      offset: 0,
      comparableType: 8,
      acctChanged: 'T',
      rnd: (new Date()).valueOf(),
    }, queryObj);

    return this.login()
      .then(() => {
        return this.requester.get(`${ URLS.listTransaction }?${ querystring.stringify(query) }`);
      });
  }

  getTrendData(query, reportType, groupIds, accountCount) {
    let dateFormat = 'M/M/YYYY';
    let dateRange = {
      period: {
        label: query.label,
        value: query.value,
      },
      start: moment(new Date(query.start)).format(dateFormat),
      end: moment(new Date(query.end)).format(dateFormat),
    };

    let data = {
      searchQuery: JSON.stringify({
        reportType,
        'chartType': 'toggleable',
        'comparison': '',
        'matchAny': true,
        'terms': [],
        'accounts': {
          'groupIds': groupIds,
          'accountIds': [],
          'count': accountCount || null,
        },
        dateRange,
        'drilldown': null,
        'categoryTypeFilter': 'all',
      }),
      token: this.token,
    };

    return this.login()
      .then(() => {
        return this.requester.post(URLS.trendData, {
          form: querystring.stringify(data),
        })
      });
  }

  bundledServiceController(service, task, id, args) {
    if (service == null || task == null || id == null) {
      throw new Error('[mint] @bundledServiceController: requires valid service, task, and id');
    }

    let _self = this;
    let data = {
      input: JSON.stringify([
        {
          args: args || {},
          service,
          task,
          id,
        },
      ]),
    }

    return this.login()
      .then(() => {
        return this.requester.post(`${ URLS.bundledServiceController }?legacy=false`, {
          form: querystring.stringify(data),
        }, null, _self.token);
      });
  }

  autocompleteFilter(query) {
    let queryObj = {
      query,
      rnd: (new Date()).valueOf(),
    };

    return this.login()
      .then(() => {
        return this.requester.get(`${ URLS.autoCompleteFilter }?${ querystring.stringify(queryObj) }`);
      });
  }

}

module.exports = Mint;
