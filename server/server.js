'use strict';

var _ = require('lodash');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var fs = require('fs');
var Mint = require('./clients/mint');
var generateTransactionJson = require('./utils/generate_transaction_json');

require('dotenv').load();

var passport = require('passport');
var StravaStrategy = require('passport-strava-oauth2').Strategy;

passport.use(new StravaStrategy(
  {
    clientID: process.env.STRAVA_CLIENT_ID,
    clientSecret: process.env.STRAVA_CLIENT_SECRET,
    callbackURL: 'http://localhost:8080/strava/auth/callback',
  },

  function(accessToken, refreshToken, profile, done) {
    console.log('[server] accessToken: ', accessToken);
    console.log('[server] refreshToken: ', refreshToken);
    console.log('[server] profile: ', profile);
    done(null, profile);
  }
));

var mint = new Mint(process.env.MINT_USERNAME, process.env.MINT_PASSWORD);

var app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
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
    generateTransactionJson();
  })
  .catch((err) => {
    throw (err);
  });


require('./routes')(app);

// APIs
require('./api/mint/mint_api.js')(app, mint);
require('./api/strava/strava_api.js')(app, null, passport);

app.use(express.static(__dirname + '/../web/app'));

app.listen(port);

console.log('listening on port 8080');
