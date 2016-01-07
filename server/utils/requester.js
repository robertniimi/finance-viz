'use strict';

var _ = require('lodash');
var fs = require('fs');
var HEADERS = require('../constants').HEADERS;
var https = require('https');
var Promise = require('bluebird');
var request = require('request');

var cookie;
var cookieJar = request.jar();
var request = request.defaults({ jar: cookieJar, strickSSL: false });

class Requester {
  constructor() {

  }

  get(endpoint, options) {
    return new Promise((resolve, reject) => {
      let headers = _.assign({}, HEADERS, { cookie });
      request(_.assign({
        headers: headers,
        json: true,
        method: 'GET',
        url: endpoint
      }, options || {}), (err, res, body) => {
        if (err) { reject(err); }
        resolve(body);
      });
    });
  }

  // options = {
  //   cookie:
  //   form:
  //   headers:
  //   json:
  // }
  post(endpoint, options, client) {
    return new Promise((resolve, reject) => {
      request(_.assign({
        json: true,
        method: 'POST',
        headers: HEADERS,
        url: endpoint
      }, options), (err, res, body) => {
        if (err) { reject(err); }
        cookie = res.headers['set-cookie'][0];
        if (client) { client.token = body.sUser.token; };
        resolve(body);
      });
    });
  }

  getFile(path, endpoint) {
    let headers = _.assign({}, HEADERS, { cookie });
    return new Promise((resolve, reject) => {
      let reqCall = () => {
        request({
          method: 'GET',
          jar: cookieJar,
          url: endpoint,
          headers: headers
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
