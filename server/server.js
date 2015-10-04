var _ = require('lodash');
var bodyParser = require('body-parser');
var express = require('express');
var fs = require('fs');
var Mint = require('./utils/client');
var GenerateTransactionJson = require('./data/generate_transaction_json');

var mint = new Mint();

require('dotenv').load();

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 8080;

mint
  .login(process.env.MINT_USERNAME, process.env.MINT_PASSWORD)
  .then(function(resBod) {
    return mint.downloadTransactions('./data/transactions.csv');
  })
  .then(function(res) {
    console.log('[server] downloadedTransactions');
    GenerateTransactionJson();
  }).catch(function(err) {
    throw (err);
  });

require('./routes')(app);

app.use(express.static(__dirname + '/../web/app'));

app.listen(port);

console.log('listening on port 8080');
