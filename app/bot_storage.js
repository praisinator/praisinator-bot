'use strict';
var db = require('./database_adapter');

module.exports = {
    teams: {
        get: function (slack_team) {
            return db.findBot(slack_team).then(function(result) {
                var bot = (!!result.error ? null : result.result.rows[0]);
                return bot;
            })
        },
        save: function() {
            console.log('WARNING: method not implemented!');
            return null;
        },
        destroy: function(slack_team) {
            return db.disableBot(slack_team)
        }
    },
    users: {
        get: function (slack_key, bot_id) {
            return db.findUserByKey(slack_key, bot_id).then(function(result) {
                var user = (!!result.error ? null : result.result.rows[0]);
                return user;
            })
        },
        save: function() {
            console.log('WARNING: method not implemented!');
            return null;
        }
    },
    channels: {
        get: function() {
            console.log('WARNING: method not implemented!');
            return null;
        },
        save: function() {
            console.log('WARNING: method not implemented!');
            return null;
        }
    }
};
