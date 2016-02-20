'use strict';
require('dotenv').config();
require('es6-promise').polyfill();
require('isomorphic-fetch');

var express        = require('express');
var db             = require('./db');
var botkit         = require('./bot');
var startup_script = require('./startup_script');
var app            = express();

startup_script.startBots();

app.set('port', (process.env.PORT || 8080));
app.set('view engine', 'jade');

app.get('/', function(req, res) {
    var redirect_uri = `${process.env.KODING_URI}/oauth`;
    res.render('index', { client_id: process.env.SLACK_CLIENT_ID, redirect_uri: redirect_uri });
})

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
})