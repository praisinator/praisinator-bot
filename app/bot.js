var Botkit  = require('botkit');
var storage = require('./storage');

var spawnBot = function(slack_team_id) {
    var controller = Botkit.slackbot({
        debug: false, // Enable to see botkit logs in realtime as events take place
        storage: storage
    });

    controller.storage.teams.get(slack_team_id).then(function(team) {
        if(!!team && team.active === true) {
            var bot = controller.spawn({
                token: team.slack_bot_token
            }).startRTM(function(error) {
                if(error === 'account_inactive') {
                    controller.storage.teams.destroy(slack_team_id)
                }
            })

            controller.on('ambient', function(bot, message) {
                var slack_key = message.user;
                var team_id   = bot.identity.id;
                var content   = message.text;

                console.log('Chat message heard!')
                //controller.storage.users.get(slack_key, team_id).then(function(user) {
                //    if(!!user) {
                //        controller.storage.messages.save(content, user_id, channel_id, slack_id).then(function(message) {
                //            console.log('Chat message saved!')
                //        })
                //    }
                //})
            })
        }
    })
}

module.exports = {
    spawnBot: spawnBot
};