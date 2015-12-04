'use strict';

var _ = require('lodash');
var cookieparser = require('cookieparser');
var querystring = require('querystring');
var GenerateTransactionJson = require('../utils/generate_transaction_json');

var Promise = require('bluebird');
var Requester = require('../utils/requester');

var URLS = require('../constants').URLS;
var HEADERS = require('../constants').HEADERS;

require('dotenv').load();

class Mint {
  constructor(username, password) {
    this.token = null;
    this.cookies = null;
    this.requester = new Requester();
    this.transactions = null;
    this.username = username;
    this.password = password;
  }

  login() {
    let _self = this;
    let cache;

    let options = {
      data: {
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

  downloadTransactions(path) {
    let headers = _.assign({}, HEADERS, {
      'host': 'wwws.mint.com',
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'cookie': this.cookies,
      'connection': 'keep-alive',
      'upgrade-insecure-requests': 1,
      'accept-encoding': 'gzip, deflate, sdch',
      'accept-language': 'en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4'
    });

    this.requester.get(URLS.transactionDownload, { headers });
  }

  updateTransaction(task, transactionObj, categoryObj) {
    task = task || 'simpleEdit';
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

  getJsonData(task) {
    // default fetch categories
    task = task || 'categories';

    let query = querystring.stringify({
      task,
      rnd: (new Date()).valueOf()
    });

    return new Promise((resolve, reject) => {
      this.login()
        .then(() => {
          this.requester.get(`${ URLS.getJsonData }?${ query }`, { cookies: this.cookies })
            .then((resBod) => {
              let res = resBod.res;
              let body = resBod.body;
              resolve(body.set[0]);
            })
            .catch((err) => {
              reject(err);
            })
        });
    });
  }

  refreshAccounts() {
    this.requester.get(URLS.refreshAccounts, { token: this.token })
      .then(() => {
        GenerateTransactionJson();
      })
      .catch((err) => {
        console.log('[client] err: ', err);
      });
    // REQUEST BODY
    // token: TOKEN
  }

}

module.exports = Mint;
