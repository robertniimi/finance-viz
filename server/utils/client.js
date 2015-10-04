var _ = require('lodash');
var cookieparser = require('cookieparser');
var Promise = require('bluebird');
var Requester = require('./requester');
var URLS = require('../constants').URLS;

var Mint = function() {
  this.token = null;
  this.cookies = null;
  this.requester = new Requester();
}

Mint.prototype = {
  login: function(username, password) {
    var _self = this;
    var cache;
    // console.log('[client] here');

    return new Promise(function(resolve, reject) {
      // console.log('[client] here');
      if (_self.token) {
        // console.log('[client] here');
        resolve(cache);
      }
      var payload = {
        task: 'L',
        username: username,
        password: password
      };

      _self.requester.post(URLS.login, payload)
        .then(function(resBod) {
          var body = resBod.body;
          var res = resBod.res;

          if (!body || !body.sUser || !body.sUser.token) {
            reject('login failed');
          }

          cache = _.cloneDeep(resBod);

          _self.cookies = res.headers['set-cookie'][0];
          _self.token = body.sUser.token;

          resolve(resBod);
        })
        .catch(function(err) {
          reject(err);
        });
    });
  },
  downloadTransactions: function(path) {
    var _self = this;
    return new Promise(function(resolve, reject) {
      if (!_self.token) { reject('@downloadTransactions: must have token'); }
      _self.requester.getFile(path, URLS.transactionDownload, _self.cookies)
        .then(function(res) {
          resolve(res);
        })
        .catch(function(err) {
          reject(err);
        });
    });
  }
}

module.exports = Mint;
