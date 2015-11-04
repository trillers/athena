/**
 * save the media file made in conversation
 */

var Promise = require('bluebird');
var fs = require('fs');
var wechatApi = require('../../wechat/common/api').api;
var fileService = require('./FileService');
var thunkify = require('thunkify');
var writeFileAsyn = thunkify(fs.writeFile);
var path = require('path');
var Service = {}

/**
 * save conversation image message by media_id
 * @param media_id
 * @param callback
 **/
Service.saveImage = function* (media_id){
    try{
        var data = yield wechatApi.getMediaAsync(media_id);
        var mediaData = data[0];
        var filePath = path.join(__dirname, '../../../../public/uploads/' + media_id + '.jpeg');
        yield writeFileAsyn(filePath, mediaData, 0, mediaData.length);
        var fileJson = {
            name: media_id + '.jpeg',
            ext: 'jpeg',
            wx_media_id: media_id,
            size: mediaData.length,
            path: filePath,
            mimeType: 'image/jpeg'
        }

        var result = yield fileService.createAsync(fileJson);

        console.log('++++++');
        console.log(result);
        return result._id;
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
        var data = yield wechatApi.getMediaAsync(media_id);
        var mediaData = data[0];
        var filePath = path.join(__dirname, '../../../../public/uploads/' + media_id + '.amr');
        yield writeFileAsyn(filePath, mediaData, 0, mediaData.length);
        var fileJson = {
            name: media_id + '.amr',
            ext: 'amr',
            size: mediaData.length,
            path: filePath,
            mimeType: 'audio/amr'
        }
        var result = yield fileService.createAsync(fileJson);
        console.log('++++++');
        console.log(result);
        return result._id;
    }catch(err){
        console.log('save conversation voice message err: ' + err);
        return null;
    }
}

module.exports = Service;
