'user strict';
var db     = require('./database_adapter');
var botkit = require('./bot');

function startBots() {
    db.allBots().then(function(result) {
        if(!!result.error) {
            console.log(`Error while starting up bots: ${result.error}`);
        } else {
            var bots = result.result.rows;
            if (!!bots) {
                bots.forEach(function(bot){
                    botkit.spawnBot(bot.bot_token, bot.slack_team);
                })
            }
        }
    })
}

module.exports = {
    startBots: startBots
}

