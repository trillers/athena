/**
 * save the media file made in conversation
 */

var Promise = require('bluebird');
var settings = require('athena-settings').api;
var token = require('../../wechat/common/token');
var request = require('request');
var Service = {};
var urlCore = require('url');
var qs = require('qs');

/**
 * save conversation image message by media_id
 * @param media_id
 * @param callback
 **/
Service.saveImage = function* (media_id){
    try{
        var imgUrl = yield getMediaUrl(media_id);
        var formData = {
            file: {
                value: request(imgUrl),
                options: {
                    filename: media_id + '.jpeg',
                    contentType: 'image/jpeg'
                }
            }
        }
        var uploadUrl = settings.url + '/file/upload';
        var result = yield new Promise(function(resolved, rejected){
            request.post({url: uploadUrl, formData: formData}, function optionalCallback(err, httpResponse, body) {
                if(err){
                    console.log('save media file upload image file err:' + err);
                    resolved(null);
                }else{
                    resolved(JSON.parse(body).media_id);
                }
            });
        });
        return result;
    }catch(err){
        console.log('save conversation image message err: ' + err);
        return null;
    }
}

/**
 * save conversation voice message by media_id
 * @param media_id
 * @param callback
 **/
Service.saveVoice = function* (media_id){
    try{
        var imgUrl = yield getMediaUrl(media_id);
        var formData = {
            file: {
                value: request(imgUrl),
                options: {
                    filename: media_id + '.amr',
                    contentType: 'audio/amr'
                }
            }
        }
        var uploadUrl = settings.url + '/file/upload';
        var result = yield new Promise(function(resolved, rejected){
            request.post({url: uploadUrl, formData: formData}, function optionalCallback(err, httpResponse, body) {
                if(err){
                    console.log('save media file upload voice file err:' + err);
                    resolved(null);
                }else{
                    resolved(JSON.parse(body).media_id);
                }
            });
        });
        return result;
    }catch(err){
        console.log('save conversation voice message err: ' + err);
        return null;
    }
}

Service.saveImageToWx = function(){

}

Service.saveVoiceToWx = function(){

}
/**
 * get media file url by media_id
 * @param media_id
 **/
var getMediaUrl = function*(media_id){
    try{
        var at = yield token.generateGetAt(false)();
        var url = 'https://api.weixin.qq.com/cgi-bin/media/get?access_token='+ at + '&media_id=' + media_id;
        return url;
    }catch(err){
        console.log('getMediaUrl err: ' + err);
        return null;
    }
}

function* getWxMediaIdByFsMediaId(msg){
    try{
        var at = yield token.generateGetAt(false)();
        var fileUrl = settings.url + '/file?media_id=' + media_id;
        var options = {
            protocol: 'https',
            host: 'api.weixin.qq.com/cgi-bin/media/upload',
            search: qs.stringify({
                access_token: at,
                type: msg.MsgType
            })
        };
        request(fileUrl).pipe(urlCore.format(options)).on('close', function(err, data){
            console.log()
        });
    }catch(err){

    }
}

module.exports = Service;
