'use strict';
require('dotenv').config();

var express        = require('express');
var fetch          = require('node-fetch');
var botkit         = require('./bot');
var startup_script = require('./startup_script');
var storage        = require('./storage');
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
        var slack_team_id    = json.team_id;
        var slack_user_token = json.access_token;
        var slack_bot_token  = json.bot.bot_access_token;
        var slack_bot_id     = json.bot.bot_user_id;
        fetch(`https://slack.com/api/team.info?token=${slack_user_token}`).then(function(response) {
            return response.json();
        }).then(function(json) {
            return json.team.icon.image_132;
        }).then(function(slack_team_logo_url) {
            fetch(`https://slack.com/api/auth.test?token=${slack_user_token}`).then(function(response) {
                return response.json();
            }).then(function(json){
                var slack_user_id   = json.user_id;
                var slack_team_name = json.team;
                if(!!slack_user_id) {
                    storage.teams.get(slack_team_id).then(function(team) {
                        if(!team) {
                            storage.teams.save(slack_team_id, slack_team_name, slack_team_logo_url, slack_bot_id, slack_bot_token).then(function(team) {
                                debugger;
                                return storage.users.save(slack_user_id, slack_user_token, team.id());
                            }).then(function(user) {
                                botkit.spawnBot(slack_team_id);
                                res.send('<p>Enjoy your new Praisinator integration!</p>');
                            })
                        } else {
                            debugger;
                            storage.users.get(slack_user_id, team.id()).then(function(user) {
                                if(!user) {
                                    storage.users.save(slack_user_id, slack_user_token, team.id()).then(function(user) {
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
})

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
})