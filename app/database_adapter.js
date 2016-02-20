'use strict';
var pg      = require('pg');
var Promise = require('promise');

function createDatabase() {
    pg.connect(process.env.DATABASE_URL, function(error, client, done) {
        if(error) {
            console.log(`Error while connecting to the database: ${error}`);
        } else {
            client.query('CREATE TABLE IF NOT EXISTS bots (id SERIAL PRIMARY KEY, slack_team varchar(255) UNIQUE, bot_token varchar(255) UNIQUE, bot_user_id varchar(255), active boolean DEFAULT true, created_at TIMESTAMP NOT NULL DEFAULT now())', function(error, result) {
                if(error) {
                    console.log(`Error while creating the bots table: ${error}`);
                } else {
                    console.log('Successfully ensured the bots table exists');
                }
            });
            client.query('CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, user_name varchar(255), slack_token varchar(255), slack_key varchar(255), bot_id integer REFERENCES bots (id), created_at TIMESTAMP NOT NULL DEFAULT now())', function(error, result) {
                if(error) {
                    console.log(`Error while creating the users table: ${error}`);
                } else {
                    console.log('Successfully ensured the users table exists');
                }
            });
            client.query('CREATE TABLE IF NOT EXISTS messages (id SERIAL PRIMARY KEY, content text, user_id integer REFERENCES users (id), created_at TIMESTAMP NOT NULL DEFAULT now())', function(error, result) {
                if(error) {
                    console.log(`Error while creating the messages table: ${error}`);
                } else {
                    console.log('Successfully ensured the messages table exists');
                }
            });
            done();
        }
    })
    pg.end()
}

function query(query) {
    return new Promise(function (resolve, reject) {
        pg.connect(process.env.DATABASE_URL, function(error, client, done) {
            if(!!error) {
                console.log(`Error while connecting to database: ${error}`);
                resolve({ error: error, result: null });
            } else {
                client.query(query, function(error, result) {
                    done();
                    resolve({ error: error, result: result });
                })
            }
        })
    });
}

function findBot(slack_team) {
    var queryString = `SELECT * FROM bots WHERE bots.slack_team='${slack_team}' LIMIT 1`;
    return query(queryString);
}

function allBots() {
    var queryString = `SELECT * FROM bots`;
    return query(queryString);
}

function disableBot(slack_team) {
    findBot(slack_team).then(function(result) {
        var bot = (!!result.error ? null : result.result.rows[0]);
        if(!!bot) {
            var queryString = `UPDATE bots SET active=false WHERE id=${bot.id}`;
            return query(queryString);
        } else {
            return new Promise(function (resolve, reject) {
                resolve();
            })
        }
    })
}

function createBot(slack_team, bot_token, bot_user_id) {
    var queryString = `INSERT INTO bots(slack_team, bot_token, bot_user_id) VALUES('${slack_team}', '${bot_token}', '${bot_user_id}') RETURNING id`;
    return query(queryString);
}

function findUserByToken(slack_token, bot_user_id) {
    var queryString = `SELECT * FROM users JOIN bots ON users.bot_id = bots.id WHERE users.slack_token='${slack_token}' AND bots.bot_user_id='${bot_user_id}' LIMIT 1`;
    return query(queryString);
}

function findUserByKey(slack_key, bot_user_id) {
    var queryString = `SELECT users.* FROM users JOIN bots ON users.bot_id = bots.id WHERE users.slack_key='${slack_key}' AND bots.bot_user_id='${bot_user_id}' LIMIT 1`;
    return query(queryString);
}

function createUser(user_name, slack_token, slack_key, bot_id) {
    var queryString = `INSERT INTO users(user_name, slack_token, slack_key, bot_id) VALUES('${user_name}', '${slack_token}', '${slack_key}', '${bot_id}')`;
    return query(queryString);
}

createDatabase();

module.exports = {
    findBot: findBot,
    allBots: allBots,
    createBot: createBot,
    disableBot: disableBot,
    findUserByToken: findUserByToken,
    findUserByKey: findUserByKey,
    createUser: createUser
}
