var assert = require('chai').assert;
var wechatBotGroupService = require('../../../../src/modules/wechat-bot/services/WechatBotGroupService');
var botManager = require('../../../../src/modules/assistant/botManager');

var mongoose = require('../../../../src/app/mongoose');

describe('wechatBotGroupService', function() {

    before(function(done){
        setTimeout(function(){
            done();
        },2000);
    })

    describe('#getGroupList', function() {
        var siteId = 'gh_afc333104d2a'; //错题本服务号的原始ID
        var openid = 'oO9zswwIYYtgOdugwQifYiLjtLN8'; //包三哥的错题本openid
        var wechatBot = null;
        before(function(done){
            botManager.on('register', function(bot){
                console.info('wechat bot is registered successfully!');
                console.info(bot);
                console.info('\r\n');
                wechatBot = bot;
                done();
            });

            var botInfo = {
                bucketid: siteId
                , openid: openid
                , nickname: '包三哥'
            };
            botManager.register(botInfo);
        });

        it('get all active groups of a bot', function (done) {
            wechatBotGroupService.getGroupList(wechatBot._id, function(err, result){
                console.info(result.length);
                console.info(result);
                done();
            });
        })
    })

    describe('#diffGroupList', function() {
        it('some to-update groups, some to-add groups and some to-remove groups', function (done) {
            var oldGroupList = [
                { username: 'group1', name: '群1'},
                { username: 'group2', name: '群2'},
                { username: 'group3', name: '群3'},
                { username: 'group4', name: '群4'},
                { username: 'group5', name: '群5'},
                { username: 'group6', name: '群6'},
                { username: 'group7', name: '群7'},
                { username: 'group8', name: '群8'},
                { username: 'group9', name: '群9'},
                { username: 'group10', name: '群10'}
            ];

            var newGroupList = [
                { username: 'group3', name: '群3'},
                { username: 'group4', name: '群4'},
                { username: 'group5', name: '群5'},
                { username: 'group6', name: '群6'},
                { username: 'group7', name: '群7'},
                { username: 'group8', name: '群8'},
                { username: 'group9-updated', name: '群9-updated'},
                { username: 'group10-updated', name: '群10-updated'},
                { username: 'group11', name: '群11'},
                { username: 'group12', name: '群12'}
            ];
            var ret = wechatBotGroupService.diffGroupList(oldGroupList, newGroupList);
            console.info(ret.toRemove);
            console.info(ret.toUpdate);
            console.info(ret.toAdd);
            done();
        })
    })

    describe('#syncGroupList', function() {
        var siteId = 'gh_afc333104d2a'; //错题本服务号的原始ID
        var openid = 'oO9zswwIYYtgOdugwQifYiLjtLN8'; //包三哥的错题本openid
        var wechatBot = null;
        before(function(done){
            botManager.on('register', function(bot){
                console.info('wechat bot is registered successfully!');
                console.info(bot);
                console.info('\r\n');
                wechatBot = bot;
                done();
            });

            var botInfo = {
                bucketid: siteId
                , openid: openid
                , nickname: '包三哥'
            };
            botManager.register(botInfo);
        });

        after(function(done){
            wechatBotGroupService.emptyGroupList(wechatBot._id, function(err, result){
                done();
            });
        });

        it('sync a empty group list with some new groups', function (done) {
            var newGroupList = [
                { username: 'group1', name: '群1'},
                { username: 'group2', name: '群2'},
                { username: 'group3', name: '群3'},
                { username: 'group4', name: '群4'},
                { username: 'group5', name: '群5'},
                { username: 'group6', name: '群6'},
                { username: 'group7', name: '群7'},
                { username: 'group8', name: '群8'},
                { username: 'group9', name: '群9'},
                { username: 'group10', name: '群10'}
            ];

            wechatBotGroupService.syncGroupList(wechatBot._id, newGroupList, function(err, result){
                console.info(result);
                assert.equal(result.adds, newGroupList.length);
                done();
            });
        })

        it('sync an old group list with added groups, removed groups and updated groups', function (done) {
            var newGroupList = [
                { username: 'group3', name: '群3'},
                { username: 'group4', name: '群4'},
                { username: 'group5', name: '群5'},
                { username: 'group6', name: '群6'},
                { username: 'group7', name: '群7'},
                { username: 'group8', name: '群8'},
                { username: 'group9-updated', name: '群9-updated'},
                { username: 'group10-updated', name: '群10-updated'},
                { username: 'group11', name: '群11'},
                { username: 'group12', name: '群12'}
            ];

            wechatBotGroupService.syncGroupList(wechatBot._id, newGroupList, function(err, result){
                console.info(result);
                assert.equal(result.adds, 4);
                assert.equal(result.removes, 4);
                assert.equal(result.updates, 0);
                done();
            });
        })
    })

})