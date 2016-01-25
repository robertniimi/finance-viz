'use strict';

var _ = require('lodash');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var fs = require('fs');
var Mint = require('./clients/mint');
var GenerateTransactionJson = require('./utils/generate_transaction_json');

require('dotenv').load();

var mint = new Mint(process.env.MINT_USERNAME, process.env.MINT_PASSWORD);

var app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 8080;

mint
  .login()
  .then((resBod) => {
    console.log('[server] logged in');
    return mint.downloadTransactions(__dirname + '/data/transactions.csv', true);
  })
  .then((res) => {
    console.log('[server] downloadedTransactions');
    GenerateTransactionJson();
  })
  .catch((err) => {
    throw (err);
  });

require('./routes')(app);
require('./api/mint_api.js')(app, mint);
// require('./api/')

app.use(express.static(__dirname + '/../web/app'));

app.listen(port);

console.log('listening on port 8080');
