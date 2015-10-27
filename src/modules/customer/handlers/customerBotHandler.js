/**
 *     ToUserName: bid
 *     FromUserName: botid (bucketid:openid)
 *     MsgType: 'text'
 *     Content: to-be-sent text String
 *     bucketid
 *     openid
 *     MediaId
 *     FsMediaId
 *
 * @param msg
 */
var co = require('co');
var conversationService = require('../../conversation/services/ConversationService');
var messageService = require('../../message/services/MessageService')
var ConversationKv = require('../../conversation/kvs/Conversation');
var mediaFileService = require('../../file/services/MediaFileService');
var MsgContentType = require('../../common/models/TypeRegistry').item('MsgContent');
var customerEmitter = require('../CustomerEmitter');

var handler = function(msg){
    co(function* (){
        try{
            var user = yield getUser();
            var cvs = null;
            var an_media_id = msg.FsMediaId;
            var cvsId = yield ConversationKv.getCurrentIdAsync(user.id);
            if(!cvsId){
                cvs = yield conversationService.createAsync({
                    initiator: user.id, createTime: new Date()
                });
                yield ConversationKv.createAsync(cvs);
                cvsId = cvs.id;
                yield ConversationKv.setCurrentIdAsync(user.id, cvsId);
                yield messageService.createAsync({
                    from: user.id,
                    to: null,
                    channel: cvsId,
                    contentType: msg.MsgType,
                    content: msg.Content || null,
                    wx_media_id: msg.MediaId || null,
                    an_media_id: an_media_id,
                    recognition: msg.Recognition || null
                });
                customerEmitter.emit('message', cvs, msg);
                customerEmitter.emit('conversation', cvs, msg);
            }
            else{
                cvs = yield conversationService.loadByIdAsync(cvsId);//TODO should load cvs from redis
                yield messageService.createAsync({
                    from: user.id,
                    to: null,
                    channel: cvsId,
                    contentType: msg.MsgType,
                    content: msg.Content || null,
                    wx_media_id: msg.MediaId || null,
                    an_media_id: an_media_id,
                    recognition: msg.Recognition || null
                });
                customerEmitter.emit('message', cvs, msg);
            }
        }catch(e){
            console.log(e.stack);
        }
    });
};
module.exports = handler;