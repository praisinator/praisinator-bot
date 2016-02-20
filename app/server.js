'use strict';
require('dotenv').config();

var express        = require('express');
var botkit         = require('./bot');
var db             = require('./database_adapter');
var fetch          = require('node-fetch');
var startup_script = require('./startup_script');
var app            = express();

startup_script.startBots();

app.set('port', (process.env.PORT || 8080));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function(req, res) {
    res.render('index', { client_id: process.env.SLACK_CLIENT_ID });
})

app.get('/oauth', function(req, res) {
    var code = req.query.code;
    var url  = `http://slack.com/api/oauth.access?client_id=${process.env.SLACK_CLIENT_ID}&client_secret=${process.env.SLACK_CLIENT_SECRET}&code=${code}`;

    fetch(url).then(function(response) {
        return response.json();
    }).then(function(json) {
        var slack_team  = json.team_id;
        var slack_token = json.access_token;
        var bot_token   = json.bot.bot_access_token;
        var bot_user_id = json.bot.bot_user_id;
        fetch(`https://slack.com/api/auth.test?token=${slack_token}`).then(function(response) {
            return response.json();
        }).then(function(json){
            var user_name = json.user;
            var slack_key = json.user_id;
            if(!!slack_key) {
                db.findBot(slack_team).then(function(result) {
                    var existing_bot = (!!result.error ? null : result.result.rows[0]);
                    if(!existing_bot) {
                        db.createBot(slack_team, bot_token, bot_user_id).then(function(result) {
                            if(result.error) {
                                res.send('<p>Oops! Something when wrong setting up your bot.</p>');
                            } else {
                                var bot_id = result.result.rows[0].id;
                                db.createUser(user_name, slack_token, slack_key, bot_id).then(function(result) {
                                    if(!result.error) {
                                        botkit.spawnBot(bot_token, slack_team);
                                        res.send('<p>Enjoy your new Praisinator integration!</p>');
                                    } else {
                                        res.send('<p>Oops! Something when wrong setting up your integration.</p>');
                                    }
                                })
                            }
                        })
                    } else {
                        db.findUserByToken(slack_token, bot_user_id).then(function(result) {
                            var existing_user = (!!result.error ? null : result.result.rows[0]);
                            if(!existing_user) {
                                db.createUser(user_name, slack_token, slack_key, existing_bot.id).then(function(result) {
                                    res.send('<p>Enjoy your new Praisinator integration!</p>');
                                })
                            } else {
                                res.send('<p>Praisinator is already configured</p>');
                            }
                        })
                    }
                })
            } else {
                res.send(`<p>Oops! Something when wrong setting up your integration, try again:</p><p>${error}</p>`);
            }
        })
    })
})

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
})