'use strict';

var _ = require('lodash');
var cookieparser = require('cookieparser');
var querystring = require('querystring');
var fs = require('fs');
var Promise = require('bluebird');
var Converter = require('csvtojson').Converter;

// Utils
var Requester = require('../utils/requester');
var GenerateTransactionJson = require('../utils/generate_transaction_json');

// Consts
var URLS = require('../constants').URLS;
var HEADERS = require('../constants').HEADERS;

/**
N

txn
**/

class Mint {
  constructor(username, password) {
    this.cookies = null;
    this.requester = new Requester();
    this.token = null;
    this.transactions = null;

    this.login = () => {
      let options = {
        form: {
          task: 'L',
          username: username,
          password: password
        }
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


  // dataObj = {
  //
  // }
  updateTransaction(dataObj) {
    console.log('[mint] @updateTransactions -> dataObj: ', dataObj);
    let data = {
      task: dataObj.task,
      txnId: `${ dataObj.id }:${ dataObj.txnType }`,
      date: dataObj.date,
      merchant: dataObj.merchant,
      category: dataObj.category,
      catId: dataObj.categoryId,
      categoryTypeFilter: null,
      token: this.token
    };

    return this.login()
      .then(() => {
        this.requester.post(`${ URLS.updateTransaction }`, {
          form: data
        })
      });

    // return this.requester.post(URLS.updateTransaction, {
    //   task,
    //   txnId:
    //   date:
    //   merchant:
    //   category:
    //   catId:
    //   categoryTypeFilter:
    //   amount:
    //   token: this.token
    // });

    // REQUEST BODY
    // task:simpleEdit
    // txnId:983040907:0
    // date:11/15/2015
    // merchant:Brewcade
    // category:Alcohol & Bars -> getJsonData
    // catId:708 -> getJsonData
    // categoryTypeFilter:null
    // amount:
    // token:8141308IDwnDov0TvtzO6iUFDmuRm4Dncu3UbDSrfmLl0uw
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
    console.log('[mint] getJsonData');
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
      rnd: (new Date()).valueOf()
    }, queryObj);

    console.log('[mint] @getJsonTransactions -> query: ', query);
    console.log('[mint] @getJsonTransactions -> querystring.stringify(query): ', querystring.stringify(query));

    return this.login()
      .then(() => {
        return this.requester.get(`${ URLS.getJsonData }?${ querystring.stringify(query) }`, {
          token: this.token
        });
      });
  }

  // Response
  // ========
  //
  getJsonCategories() {
    let query = {
      task: 'categories',
      rnd: (new Date()).valueOf()
    };

    return this.login()
      .then(() => {
        return this.requester.get(`${ URLS.getJsonData }?${ querystring.stringify(query) }`, {
          token: this.token
        });
      });
  }

  // Response
  // ========
  //
  refreshAccounts() {
    console.log('[mint] refreshAccounts');
    let formData = querystring.stringify({ token: this.token });
    this.login()
      .then(() => {
        return this.requester.post(URLS.refreshAccounts, {
          form: formData
        });
      })
      .then((response) => {
        console.log('[mint] @refreshAccounts: SUCCESS');
        console.log('[mint] @refreshAccounts -> response: ', response);
        GenerateTransactionJson();
      })
      .catch((err) => {
        console.log('[client] err: ', err);
      });
    // REQUEST BODY
    // token: TOKEN
  }

  // Response
  // ========
  //
  refreshJob() {
    return this.login()
      .then(() => {
        return this.requester.get(URLS.refreshJob);
      });
  }

  // Response
  // ========
  //
  // queryObj = {
  //   accountId: (number)
  //   filterType: (string) 'cash' ||
  //   queryNew:
  //   offset: (number)
  //   comparableType: (number)
  //   acctChanged: (string) 'T' || 'F'
  //   rnd: (date value number)
  // }
  listTransaction(queryObj) {
    let query = _.assign({
      accountId: 0,
      filterType: 'cash',
      queryNew: '',
      offset: 0,
      comparableType: 8,
      acctChanged: 'T',
      rnd: (new Date()).valueOf()
    }, queryObj);

    console.log('[mint] @listTransaction -> query: ', query);

    // accountId:1607687
    // filterType:
    // queryNew:
    // offset:0
    // comparableType:8
    // acctChanged:T
    // rnd:627
    // typeSort:8

    // accountId:1607687
    // query:category: Uncategorized
    // offset:0
    // comparableType:8
    // acctChanged:T
    // rnd:1449291130044

    // if (queryObj) {
    //   query = {

    //   }
    // };

    return this.login()
      .then(() => {
        return this.requester.get(`${ URLS.listTransaction }?${ querystring.stringify(query) }`);
      });

  }

  // {
  // "totalResultsReturned":2,
  // "results":[
  //    {
  //       "value":"description: Ko Catering Pies"
  //    },
  //    {
  //       "value":"description: Purdue Memorial Union Catering"
  //    }
  // ],
  // "totalResultsAvailable":2
  // }
  autocompleteFilter(query) {
    let queryObj = {
      query,
      rnd: (new Date()).valueOf()
    };

    return this.login()
      .then(() => {
        return this.requester.get(`${ URLS.autoCompleteFilter }?${ querystring.stringify(queryObj) }`);
      });
    // https://wwws.mint.com/autocompleteFilter.xevent?query=cate&rnd=1450050382368
  }

}

module.exports = Mint;
