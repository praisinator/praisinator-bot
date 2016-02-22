var Botkit  = require('botkit');
var storage = require('./storage');

var spawnBot = function(slack_team_id) {
    var controller = Botkit.slackbot({
        debug: false, // Enable to see botkit logs in realtime as events take place
        storage: storage
    });

    controller.storage.teams.get(slack_team_id).then(function(team) {
        if(team.attribute('active') === true) {
            var bot = controller.spawn({
                token: team.attribute('slack_bot_token')
            }).startRTM(function(error) {
                if(error === 'account_inactive') {
                    controller.storage.teams.destroy(slack_team_id)
                }
            })

            controller.on('ambient', function(bot, message) {
                var slack_user_id    = message.user;
                var slack_team_id    = message.team;
                var slack_channel_id = message.channel;
                var timestamp        = message.ts;
                var content          = message.text;

                console.log('Chat message heard!');

                storage.messages.save(content, slack_user_id, slack_channel_id, slack_team_id, timestamp).then(function(message) {
                    console.log('Chat message saved!');
                }).catch(function(error) {
                    console.log(`Error creating message/channel: ${error}`);
                })
            })
        }
    })
}

module.exports = {
    spawnBot: spawnBot
};
