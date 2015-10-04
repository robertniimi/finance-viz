var _ = require('lodash');
var fs = require('fs');
var HEADERS = require('../constants').HEADERS;
var https = require('https');
var Promise = require('bluebird');
var request = require('request');


var cookie_jar = request.jar();
var request = request.defaults({ jar: cookie_jar, strickSSL: false });
// var request = request.defaults({ jar: true });
var Requester = function() {};

Requester.prototype = {
  get: function(endpoint) {
    return new Promise(function(resolve, reject) {
      request({
        headers: HEADERS,
        json: true,
        method: 'GET',
        url: endpoint
      }, function(err, res, body) {
        if (err) { reject(err); }
        resolve({ res: res, body: body });
      });
    });
  },
  post: function(endpoint, data) {
    return new Promise(function(resolve, reject) {
      request({
        form: data,
        headers: HEADERS,
        json: true,
        method: 'POST',
        url: endpoint
      }, function(err, res, body) {
        if (err) { reject(err); }
        resolve({ res: res, body: body });
      });
    });
  },
  getFile: function(path, endpoint, cookies) {
    return new Promise(function(resolve, reject) {
      var reqCall = function() {
        var data = '';
        request({
          method: 'GET',
          url: endpoint,
          headers: _.assign({}, HEADERS, {
            'host': 'wwws.mint.com',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'cookie': cookies,
            'connection': 'keep-alive',
            'upgrade-insecure-requests': 1,
            'accept-encoding': 'gzip, deflate, sdch',
            'accept-language': 'en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4'
          })
        })
          .pipe(fs.createWriteStream(path))
          .on('close', function() {
            console.log('[requester] closing stream');
            resolve();
          });
          // .on('response', function(response) {
          //   console.log('[requester] got response');
          //   var contentType = response.headers['content-type'];
          //   resolve(response);
          // })

      }

      reqCall();
    });

    console.log('[requester] endpoint: ', endpoint);
  }
}


module.exports = Requester;
