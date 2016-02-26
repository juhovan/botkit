/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
          \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
           \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/


This is a sample Slack bot built with Botkit.

This bot demonstrates many of the core features of Botkit:

* Connect to Slack using the real time API
* Receive messages based on "spoken" patterns
* Reply to messages
* Use the conversation system to ask questions
* Use the built in storage system to store and retrieve information
  for a user.

# RUN THE BOT:

  Get a Bot token from Slack:

    -> http://my.slack.com/services/new/bot

  Run your bot from the command line:

    set token=<MY TOKEN>
	
	node bot.js

# USE THE BOT:

  Find your bot inside Slack to send it a direct message.

  Say: "Hello"

  The bot will reply "Hello!"

  Say: "who are you?"

  The bot will tell you its name, where it running, and for how long.

  Say: "Call me <nickname>"

  Tell the bot your nickname. Now you are friends.

  Say: "who am I?"

  The bot will tell you your nickname, if it knows one for you.

  Say: "shutdown"

  The bot will ask if you are sure, and then shut itself down.

  Make sure to invite your bot into other channels using /invite @<my bot>!

# EXTEND THE BOT:

  Botkit is has many features for building cool and useful bots!

  Read all about it here:

    -> http://howdy.ai/botkit

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var MathHelper = require('./botmath.js');
var Botkit = require('./lib/Botkit.js');
var os = require('os');

var controller = Botkit.slackbot({
    debug: true,
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();

const weather = require('weather-js');
const request = require('request');



controller.hears(['speedrun (.*)'],'direct_message,direct_mention,mention',function(bot, message) {
    var gameInfo;
    if (message.match[1].indexOf(', ')!==-1) {
        gameInfo = message.match[1].split(", ");
    }else{
        gameInfo=[];
        gameInfo.push(message.match[1]);
    }
    console.log(gameInfo);
    var gamename = gameInfo[0];
    console.log(gamename);
    var difficulty;
    if(gameInfo.length>1){
        difficulty=gameInfo[1];
    }
    gamename.replace(' ', '%20');
    request.get({url: "http://www.speedrun.com/api_records.php?game="+gamename, timeout: 15000}, function(err, res, body) {
        if(err){
            console.log("ERROR: " + err);
            return callback(err);
        }
        else if(res.statusCode !== 200) {
            console.log("res.statusCode !== 200");
            return callback('Request failed (' + res.statusCode + ')');
        }
        else{
            body = JSON.parse(body);
            console.log(body);
            if(body.hasOwnProperty(gamename)){
                var game = body[gamename];
                if(difficulty !== undefined && game.hasOwnProperty(difficulty)){
                    var gameWithDif =game[difficulty];
                    bot.reply(message,gameWithDif['timeigt'], null, 2);
                    bot.reply(message,gameWithDif['video'], null, 2);
                }else if(difficulty===undefined){
                    for(key in game){
                        bot.reply(message,key, null, 2);
                    }
                }
            }
        }
    });

});

controller.on('user_typing',function(bot, message) {
	controller.storage.users.get(message.user,function(err, user) {
        if (user && user.name) {
            bot.reply(message, user.name + ' is typing something. Is it going to be a novel?');
        } else {
            bot.reply(message,'Someone is typing... STOP IT! DO NOT TYPE! YOU ARE MAKING ME NERVOUS');
        }
    });
});

controller.on('user_channel_join',function(bot, message) {
	controller.storage.users.get(message.user,function(err, user) {
        if (user && user.name) {
            bot.reply(message,'Welcome to the channel ' + user.name + '!!');
        } else {
            bot.reply(message,'Welcome to the channel!');
        }
    });
});

controller.hears(['How is the weather in (.*), (.*)'],'direct_message,direct_mention,mention',function(bot, message) {

    var input1 = message.match[1];
    var input2 = message.match[2];
    console.log(input1);
    console.log(input2);
    weather.find({search: input1 + " " + input2, degreeType: 'C'}, function (err, result) {
        console.log(JSON.stringify(result, null, 2));
        if(result !== undefined){
            bot.reply(message, JSON.stringify(result[0].current.temperature, null, 2));
        }else{
            bot.reply(message, "You dont make any sence");
        }
    });
});


controller.hears(['hello','hi'],'direct_message,direct_mention,mention',function(bot, message) {

    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    },function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(',err);
        }
    });
	var answers = ["Hello", "Hi", "Good day to you", "HELLO-HELLO-HELLO", "Moi", "Salute", "Greetings", "Hallo"]
	var rand = Math.floor((Math.random() * answers.length));
	
    controller.storage.users.get(message.user,function(err, user) {
        if (user && user.name) {
            bot.reply(message,answers[rand] + ", " + user.name + '!!');
        } else {
            bot.reply(message,answers[rand]);
        }
    });
});

controller.hears(['call me (.*)'],'direct_message,direct_mention,mention',function(bot, message) {
    var matches = message.text.match(/call me (.*)/i);
    var name = matches[1];
    controller.storage.users.get(message.user,function(err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        user.name = name;
        controller.storage.users.save(user,function(err, id) {
            bot.reply(message,'Got it. I will call you ' + user.name + ' from now on.');
        });
    });
});

controller.hears(['what is my name','who am i'],'direct_message,direct_mention,mention',function(bot, message) {

    controller.storage.users.get(message.user,function(err, user) {
        if (user && user.name) {
            bot.reply(message,'Your name is ' + user.name);
        } else {
            bot.reply(message,'I don\'t know yet!');
        }
    });
});


controller.hears(['shutdown'],'direct_message,direct_mention,mention',function(bot, message) {

    bot.startConversation(message,function(err, convo) {
        convo.ask('Are you sure you want me to shutdown?',[
            {
                pattern: bot.utterances.yes,
                callback: function(response, convo) {
                    convo.say('Bye!');
                    convo.next();
                    setTimeout(function() {
                        process.exit();
                    },3000);
                }
            },
        {
            pattern: bot.utterances.no,
            default: true,
            callback: function(response, convo) {
                convo.say('*Phew!*');
                convo.next();
            }
        }
        ]);
    });
});

controller.hears(['uptime','identify yourself','who are you','what is your name'],'direct_message,direct_mention,mention',function(bot, message) {

    var hostname = os.hostname();
    var uptime = formatUptime(process.uptime());

    bot.reply(message,':robot_face: I am a bot named <@' + bot.identity.name + '>. I have been running for ' + uptime + ' on ' + hostname + '.');

});

controller.hears(['fibonacci'], 'direct_message,direct_mention,mention', function(bot, message) {
    if (message.text === 'fibonacci') {
        bot.reply(message, '1, 1, 2, 3, 5');
    }
});

controller.hears(['fibonacci ([0-9]+)'], 'direct_message,direct_mention,mention', function(bot, message) {
    var parameter = parseInt(message.match[1]);
    
    var fibonacci = calculateFibonacciUpto(parameter);
    
    if (fibonacci[fibonacci.length-1] !== parameter) {
        bot.reply(message, 'That is not a Fibonacci number!');
    }
    else {
        var a = fibonacci[fibonacci.length-1];
        var b;
        if(fibonacci.length>1){
            b=fibonacci[fibonacci.length-2];
        }else{
            b=0;
        }
        var nextFive = [];
        for(var i = 0; i<5; i++){
            nextFive.push(a+b);
            b = a;
            a = nextFive[i];
        }
        bot.reply(message, nextFive.slice(0,nextFive.length).join(', '));
    }
});

function calculateFibonacciUpto(goal) {
    var fibonacci = [1, 1];
    while (fibonacci[fibonacci.length-1] < goal) {
        fibonacci.push(fibonacci[fibonacci.length-2] + fibonacci[fibonacci.length-1]);
    }
    return fibonacci;
}

// module.exports.calculateFibonacciUpto = calculateFibonacciUpto;

function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}



controller.on('channel_leave',function(bot,message) {
	
	controller.storage.users.get(message.user, function(err, user) {
	if(user && user.name) {
		bot.reply(message,"Ok, " + user.name+", go find a new channel of your own with blackjack and hookers!");
	}
	else {
		bot.reply(message,"Someone left the channel");
	}
	});
});

controller.hears('prime',['direct_message', 'direct_mention', 'mention'],function(bot,message) {
    if (message.text === "prime") {
        return bot.reply(message, '2, 3, 5, 7, 11, 13, 17, 19, 23, 29');
    }
});

controller.hears('prime (.*)',['direct_message', 'direct_mention', 'mention'],function(bot,message) {

    var parameter = parseInt(message.match[1]);

    if (MathHelper.isPrime(parameter)) {
        var primes = new Array();
        var number = parameter + 1;

        while (primes.length < 10) {

            if (MathHelper.isPrime(number)) {
                primes.push(number);
            }
            
            if(number ==0) {
            	break;
            }

            number--;
        }

        var reply = "";
        for (var i = 0; i < primes.length; i++) {
            reply += primes[i] + " ";
        }

        return bot.reply(message, reply);
    }
    else {
        return bot.reply(message, "your parameter: " + parameter + " is not Prime number");
    }
});

