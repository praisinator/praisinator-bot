var Botkit      = require('botkit');
var bot_storage = require('./bot_storage');

var spawnBot = function(bot_token, slack_team) {
    var controller = Botkit.slackbot({
        debug: false, // Enable to see botkit logs in realtime as events take place
        storage: bot_storage
    });

    controller.storage.teams.get(slack_team).then(function(existing_bot) {
        if(!!existing_bot && existing_bot.active === true) {
            var bot = controller.spawn({
                token: bot_token
            }).startRTM(function(error) {
                if(error === 'account_inactive') {
                    controller.storage.teams.destroy(slack_team)
                }
            })

            controller.on('ambient', function(bot, message) {
                var slack_key   = message.user;
                var bot_user_id = bot.identity.id;
                var content     = message.text;

                console.log('Chat message heard!')
            })
        }
    })
}

module.exports = {
    spawnBot: spawnBot
};