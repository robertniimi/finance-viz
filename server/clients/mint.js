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

class Mint {
  constructor(username, password) {
    this.cookies = null;
    this.requester = new Requester();
    this.token = null;
    this.transactions = null;

    this.username = username;
    this.password = password;
  }

  _formatQuery(queryObj) {
    console.log('[mint] @_formatQuery -> queryObj: ', queryObj);
    if (!queryObj || !queryObj.query) {
      return {};
    }

    return _.reduce(queryObj.query, (result, value, key) => {
      console.log('[mint] value: ', value);
      console.log('[mint] key: ', key);
      result.query = `${key}:${value}`;
      return result;
    }, {});
  }

  login() {
    let _self = this;
    let cache;

    let options = {
      form: {
        task: 'L',
        username: this.username,
        password: this.password
      },
      headers: HEADERS
    }

    return new Promise((resolve, reject) => {
      _self.requester.post(URLS.login, options)
        .then((resBod) => {
          let body = resBod.body;
          let res = resBod.res;

          if (!body || !body.sUser || !body.sUser.token) {
            reject('login failed');
          }

          cache = _.cloneDeep(resBod);

          _self.cookies = res.headers['set-cookie'][0];
          _self.token = body.sUser.token;

          resolve(resBod);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  downloadTransactions(path, saveAsJson) {
    let _self = this;
    let headers = _.assign({}, HEADERS, {
      'host': 'wwws.mint.com',
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'cookie': this.cookies,
      'connection': 'keep-alive',
      'upgrade-insecure-requests': 1,
      'accept-encoding': 'gzip, deflate, sdch',
      'accept-language': 'en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4'
    });

    return this.requester.getFile(path, URLS.transactionDownload, { headers })
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

    return new Promise((resolve, reject) => {
      this.login()
        .then(() => {
          this.requester.post(`${ URLS.updateTransaction }`, {
            cookies: this.cookies,
            headers: HEADERS,
            form: data
          })
        })
        .then((success) => {
          resolve(success);
        })
        .catch((err) => {
          console.error('[mint] err: ', err);
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

    return new Promise((resolve, reject) => {
      this.login()
        .then(() => {
          return this.requester.get(`${ URLS.getJsonData }?${ query }`, {
            cookies: this.cookies,
            headers: HEADERS
          });
        })
        .then((resBod) => {
          resolve(resBod.body);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

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

    return new Promise((resolve, reject) => {
      this.login()
        .then(() => {
          return this.requester.get(`${ URLS.getJsonData }?${ querystring.stringify(query) }`, {
            cookies: this.cookies,
            headers: HEADERS,
            token: this.token
          });
        })
        .then((resBod) => {
          resolve(resBod.body);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getJsonCategories() {
    let query = {
      task: 'categories',
      rnd: (new Date()).valueOf()
    };

    return new Promise((resolve, reject) => {
      this.login()
        .then(() => {
          return this.requester.get(`${ URLS.getJsonData }?${ querystring.stringify(query) }`, {
            cookies: this.cookies,
            headers: HEADERS,
            token: this.token
          });
        })
        .then((resBod) => {
          resolve(resBod.body);
        })
        .catch((err) => {
          reject(err);
        })
    })
  }

  refreshAccounts() {
    console.log('[mint] refreshAccounts');
    this.login()
      .then(() => {
        return this.requester.get(URLS.refreshAccounts, { token: this.token });
      })
      .then(() => {
        GenerateTransactionJson();
      })
      .catch((err) => {
        console.log('[client] err: ', err);
      });
    // REQUEST BODY
    // token: TOKEN
  }

  refreshJob() {
    return new Promise((resolve, reject) => {
      this.login()
        .then(() => {
          return this.requester.get(URLS.refreshJob);
        })
        .then((resBod) => {
          let body = resBod.body;
          resolve(body);
        });
    });
  }

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

    return new Promise((resolve, reject) => {
      this.login()
        .then(() => {
          return this.requester.get(`${ URLS.listTransaction }?${ querystring.stringify(query) }`);
        })
        .then((resBod) => {
          let body = resBod.body;
          resolve(body);
        })
        .catch((err) => {
          console.error('[mint] err: ', err);
          reject(err);
        })
    })

  }

}

module.exports = Mint;
