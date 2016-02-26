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
var weather = require('weather-js');

if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var MathHelper = require('./botmath.js');
var Botkit = require('./lib/Botkit.js');
var os = require('os');
var botmath = require('./botmath.js');
var fibo = require('./fibonacci.js');


var controller = Botkit.slackbot({
    debug: true,
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();


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


    controller.storage.users.get(message.user,function(err, user) {
        if (user && user.name) {
            bot.reply(message,'Hello ' + user.name + '!!');
        } else {
            bot.reply(message,'Hello.');
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


controller.hears(['google','googleta'],'direct_message,direct_mention,mention',function(bot, message) {

    controller.storage.users.get(message.user,function(err, user) {
		
		if(err) console.log(err);
		
         var link = String(botmath.googlefunc('kala ravintola'));
		 console.log('link in callback' + link);
		
            bot.reply(message,'Hi, I found a anwser for you. Check this out: ' + link);
        
    });
});

controller.hears(['who made me'],'direct_message,direct_mention,mention',function(bot, message) {

    controller.storage.users.get(message.user,function(err, user) {
        if (user && user.name) {
            bot.reply(message,user.name + ' made me');
        } else {
            bot.reply(message,'I don\'t know yet!');
        }
    });
});

controller.on('user_channel_join',function(bot, message) {
		var poembase = [
				"Roses are red, my cat eat dogs for breakfast",
				"Gangters are like pets",
				"Roses are red Violets are blue Rhyming is hard Like I am for you",
				"Roses are okay Violets are fine You be the 6 And I'll be the 9",
				"Roses are red Violets are violet Here is my number Why don't you dial it?",
		];
		var selecteditem = parseInt(poembase.length * Math.random(), 10);
		var thispoem = poembase[selecteditem];
		
        bot.reply(message, 'My poem is here: ' + thispoem);
});

controller.hears(['how is the weather in (.*)'],'direct_message,direct_mention,mention',function(bot, message) {

	    var matches = message.text.match(/how is the weather in (.*)/i);
		var city = matches[1]; 

    controller.storage.users.get(message.user,function(err, user) {
        if (city) {
		
		weather.find({search: ''+city+'', degreeType: 'C'}, function(err, result) {
		if(err) console.log(err);
		
		/*
		console.log("LOCATION " + JSON.stringify(result[0].location.name, null, 2));
		*/
		
		var cityname = JSON.stringify(result[0].location.name, null, 2);
		var temperature = JSON.stringify(result[0].current.temperature, null, 2);
		var weather = JSON.stringify(result[0].current.skytext, null, 2);
		
		bot.reply(message,'The weather in ' + cityname + ' ,' +' Temperature: ' + temperature + 'C ,' + " Weather: " + weather);
		
		});

        } if(!city) {
            bot.reply(message,'Please give city.');
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
controller.hears(['prime'],'direct_message,direct_mention,mention',function(bot, message) {

    controller.storage.users.get(message.user,function(err, user) {
        bot.reply(message,'2,  3,  5,  7,  11,  13,  17,  19,  23,  29');

    });
});

controller.hears(['prime (.*)'],'direct_message,direct_mention,mention',function(bot, message) {
	
	var numbers = message.text.match(/prime (.*)/i);
	var number = numbers[1];
	
	var test = number / number;
	var sectest = number / 2;


    controller.storage.users.get(message.user,function(err, user) {
        
		if(test == 1 && sectest % 1 != 0) {
			bot.reply(message,number +' is prime number');
		} else if (number == 2) {
			bot.reply(message,number +' is prime number');
		} else {
			bot.reply(message,number +' is not prime number');
			
			var count = 0;
			var primenumbers = [];
			var jako
			var jako2
			
			while(count < 10)
			{
				number--;
				
				jako = number / number;
				jako2 = number / 2;
				
				if(jako == 1 && jako2 % 1 !== 0 || number == 2 || number == -2 || number == 0)
				{
		
					primenumbers.push(number);
					count++;
					
				}
			
			}
			bot.reply(message,'next 10 prime numbers are: ' + primenumbers);			
		}
    });
});

controller.hears(['fibonacci'], 'direct_message,direct_mention,mention', function(bot, message) {
    if (message.text === 'fibonacci') {
        bot.reply(message, 'First five fibonacci numbers: 1, 1, 2, 3, 5');
    }
});

controller.hears(['fibonacci ([0-9]+)'], 'direct_message,direct_mention,mention', function(bot, message) {
    var parameter = parseInt(message.match[1]);

    var fibonacci = fibo.calculateFibonacciUpto(parameter);

    if (fibonacci[fibonacci.length-1] !== parameter) {
        bot.reply(message, 'That is not a Fibonacci number!');
    }
    else {
        var nextFibs = fibo.calculateNextFiveFibonacci(fibonacci);
        bot.reply(message,"That is a Fibonacci number! Here are the next 5: " + nextFibs);
    }
});


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
};


/*
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

            number++;
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
*/

controller.hears('what is (.*) \\+ (.*)',['direct_message', 'direct_mention', 'mention'],function(bot,message) {

	var num1 = message.match[1];
	var num2 = message.match[2];
		
	if (num1 != null && num2 != null) {
		return bot.reply(message, num1 + ' + ' + num2 + ' = ' + botmath.sum(num1, num2));
	}

});

