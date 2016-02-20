Praisinator Bot
=========
Praisinator Bot is a Slackbot integration that listens in to your team's public conversations and runs sentiment analysis in real time to report the mood and morale of your team.

It integrates with Praisinator Web in order to deliver informative analytics and reporting. This allows you to see who's having the most positive and negative effect on your team and take actionable steps to correct or praise them.

Pre-requisites
---------------
- [Have a functioning development environment](http://tutorials.jumpstartlab.com/topics/environment/environment.html)
- Have Node and NPM installed

Installation
--------------
Clone the repo and install its dependencies:
```sh
$ git clone git@github.com:with-our-powers-combined/praisinator-bot.git
$ cd praisinator-bot/
$ npm install
```

Run the Server
---------------
Just type:
```sh
$ node app/server.js
```
and visit [localhost:8080](http://localhost:8080).

You'll probably want to run a DNS forwarding service such as ngrok or Pagekite in order to authenticate with Slack.