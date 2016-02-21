'use strict';
var JSONAPIonify = require('JSONAPIonify-client');
var errors       = require('JSONAPIonify-client/errors');
var api = new JSONAPIonify(process.env.PRAISINATOR_API, { headers: {} });

var teams = {
    //t.string   "slack_id"
    //t.string   "name"
    //t.string   "slack_bot_id"
    //t.string   "logo_url"
    //t.string   "slack_bot_token"
    //t.bool     "active"
    all: function() {
        return api.resource('teams').list().catch(function(error) {
            console.error(error)
            return [];
        });
    },
    get: function (slack_team_id) {
        return api.resource('teams').read(slack_team_id).catch(function(error) {
            console.error(error)
            return null;
        });
    },
    save: function(slack_team_id, slack_team_name, slack_team_logo_url, slack_bot_id, slack_bot_token) {
        var attributes = {
            //active: true,
            name: slack_team_name,
            logo_url: slack_team_logo_url,
            slack_bot_id: slack_bot_id,
            slack_bot_token: slack_bot_token
        };

        return api.resource('teams').createWithId(slack_team_id, attributes, {}).catch(function(error){
            console.error(error)
            return false;
        });
    },
    update: function(slack_team_id, attributes) {
        return this.get(slack_team_id).then(function(team) {
            if(!!team) {
                return team.update(attributes).catch(function(error){
                    console.error(error)
                    return false;
                });
            }
        })
    },
    destroy: function(slack_team_id) {
        return this.update(slack_team_id, { active: false });
    }
};

var users = {
    //t.integer  "team_id",      null: false
    //t.string   "slack_id"
    //t.string   "access_token"
    get: function(slack_user_id, slack_team_id) {
        return api.resource('users').read(slack_team).catch(function(error) {
            console.error(error)
            return null;
        })
    },
    save: function(slack_user_id, slack_user_token, slack_team_id) {
        var attributes = {
            access_token: slack_user_token,
            team_id: slack_team_id
        };

        return api.resource('users').createWithId(slack_user_id, attributes, {}).catch(function(error) {
            console.error(error)
            return null;
        })
    },
    update: function() {
        console.log('WARNING: method not implemented!');
        return null;
    },
    destroy: function() {
        console.log('WARNING: method not implemented!');
        return null;
    }
};

var messages = {
    //t.integer  "channel_id", null: false
    //t.integer  "user_id",    null: false
    //t.string   "slack_id"
    //t.text     "content"
    get: function() {
        console.log('WARNING: method not implemented!');
        return null;
    },
    save: function(content, slack_user_id, slack_channel_id, slack_team_id) {
        api.resource('teams').read(team_id).then(function(team){
            return team.related('channels').then(function(channels){
                var existingChannel = _.find(channels, function(c) {
                    c.id() == channel_id
                });
                if(existingChannel) {
                    return existingChannel;
                } else {
                    return channels.createWithId(channel_id);
                }
            }).then(function(channel){
                return channel.related('messages')
            }).then(function(messages){
                return messages.create({ content: content })
            })
        })
    },
    update: function() {
        console.log('WARNING: method not implemented!');
        return null;
    },
    destroy: function() {
        console.log('WARNING: method not implemented!');
        return null;
    }
};

var channels = {
    //t.integer  "team_id",    null: false
    //t.string   "slack_id"
    get: function() {
        console.log('WARNING: method not implemented!');
        return null;
    },
    save: function() {
        console.log('WARNING: method not implemented!');
        return null;
    },
    update: function() {
        console.log('WARNING: method not implemented!');
        return null;
    },
    destroy: function() {
        console.log('WARNING: method not implemented!');
        return null;
    }
};

module.exports = {
    teams: teams,
    users: users,
    channels: channels,
    messages: messages
};
