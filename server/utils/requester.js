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
      request({
        cookie: options.cookies,
        headers: options.headers,
        json: true,
        method: 'GET',
        url: endpoint
      }, (err, res, body) => {
        if (err) { reject(err); }
        resolve({ res, body });
      });
    });
  }

  post(endpoint, options) {
    return new Promise((resolve, reject) => {
      request({
        cookie: options.cookies,
        form: options.data,
        headers: options.headers,
        json: true,
        method: 'POST',
        url: endpoint
      }, (err, res, body) => {
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
          });
      }

      reqCall();
    });

    console.log('[requester] endpoint: ', endpoint);
  }

}

module.exports = Requester;
