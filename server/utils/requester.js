'use strict';

var _ = require('lodash');
var fs = require('fs');
var HEADERS = require('../constants').HEADERS;
var https = require('https');
var Promise = require('bluebird');
var request = require('request');

var cookie_jar = request.jar();
var request = request.defaults({ jar: cookie_jar, strickSSL: false });

class Requester {
  constructor() {

  }

  get(endpoint, options) {
    return new Promise((resolve, reject) => {
      request(_.assign({
        cookie: null,
        headers: null,
        json: true,
        method: 'GET',
        url: endpoint
      }, options), (err, res, body) => {
        if (err) { reject(err); }
        resolve({ res, body });
      });
    });
  }

  // options = {
  //   cookie:
  //   form:
  //   headers:
  //   json:
  // }
  post(endpoint, options) {
    return new Promise((resolve, reject) => {
      request(_.assign({
        json: true,
        method: 'POST',
        url: endpoint
      }, options), (err, res, body) => {
        if (err) { reject(err); }
        resolve({ res, body });
      });
    });
  }

  getFile(path, endpoint, options) {
    return new Promise((resolve, reject) => {
      let reqCall = () => {
        request({
          method: 'GET',
          url: endpoint,
          headers: options.headers
        })
          .pipe(fs.createWriteStream(path))
          .on('close', () => {
            resolve();
          })
          .on('error', (err) => {
            reject(err);
          });
      }

      reqCall();
    });
  }

}

module.exports = Requester;
