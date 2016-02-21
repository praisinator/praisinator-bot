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
                var slack_user_id    = message.user;
                var slack_team_id    = bot.identity.id;
                var slack_channel_id = '';
                var content          = message.text;

                debugger;

                console.log('Chat message heard!')

                storage.messages.save(content, slack_user_id, slack_channel_id, slack_team_id).then(function(message) {
                    console.log('Chat message logged')
                }).catch(function(error) {
                    console.log(`Error logging message: ${error}`);
                })
            })
        }
    })
}

module.exports = {
    spawnBot: spawnBot
};