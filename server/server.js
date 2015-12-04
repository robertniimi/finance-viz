'use strict';

var _ = require('lodash');
var bodyParser = require('body-parser');
var express = require('express');
var fs = require('fs');
var Mint = require('./clients/mint');
var GenerateTransactionJson = require('./utils/generate_transaction_json');

var mint = new Mint(process.env.MINT_USERNAME, process.env.MINT_PASSWORD);

require('dotenv').load();

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 8080;

mint
  .login()
  .then((resBod) => {
    console.log('[server] logged in');
    return mint.downloadTransactions('./data/transactions.csv');
  })
  .then((res) => {
    console.log('[server] downloadedTransactions');
    GenerateTransactionJson();
  })
  .catch((err) => {
    throw (err);
  });

require('./routes')(app);
require('./api/mintApi.js')(app, mint);

app.use(express.static(__dirname + '/../web/app'));

app.listen(port);

console.log('listening on port 8080');
