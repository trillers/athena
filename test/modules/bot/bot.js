var BotManagerFactory = require('vk');
var rabbitmq = require('base-settings').rabbitmq;
var assert = require('chai').assert;
var url = 'amqp://' +rabbitmq.username + ':' + rabbitmq.password + '@' + rabbitmq.host + ':' + rabbitmq.port + '/' + rabbitmq.vhost;
var open = require('amqplib').connect(url);
describe('bot command', function(){
    it('start bot', function(done){
        var botManagerPromise = BotManagerFactory.create(open);
        botManagerPromise.then(function(botManager){
            var bot = botManager.getBot('bot1');
            bot.start();
            setTimeout(function(){
                done()}, 2000);
        })
    })
})
