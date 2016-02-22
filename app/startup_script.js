'user strict';
var botkit  = require('./bot');
var storage = require('./storage');

function startBots() {
    storage.teams.all().then(function(teams) {
        teams.forEach(function(team){
            botkit.spawnBot(team.id());
        })
    })
}

module.exports = {
    startBots: startBots
}
