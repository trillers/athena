var util = require('util');
var logger = require('../../app/logging').logger;
var FileService = require('../../modules/file/services/FileService');
var wechatApi = require('../../modules/wechat/common/api').api;
var fs = require('fs');
var path = require('path');
var thunkify = require('thunkify');
var readFile = thunkify(fs.readFile);

module.exports = function(router){
    /**
     * get file
     * */
    router.get('/', function* (){
        var self = this;
        console.log(self.query);
        var media_id = self.query.media_id;
        try {
            var file = yield FileService.loadAsync(media_id);
            console.log(file);
            self.type = file.mimeType;
            self.body = yield readFile(file.path);
        }catch(err){
            console.log(err);
            self.body = '404';
        }
    });

    /**
     * upload file
     * */
    router.post('/upload', function* (){
        var self = this;
        if(self.request.body.files) {
            var file = self.request.body.files.file;
            var fileJson = {
                name: file.name,
                ext: file.extension,
                size: file.size,
                path: file.path,
                mimeType: file.type
            }
            console.log('*************************************');
            console.log(fileJson);
            try {
                var wx_media_id = null;
                if(file.type.split('/')[0] === 'image'){
                    var imageData = yield wechatApi.uploadMediaAsync(file.path, 'image');
                    wx_media_id = imageData[0].media_id;
                } else if(file.type.split('/')[0] === 'audio'){
                    var voiceData = yield wechatApi.uploadMediaAsync(file.path, 'voice');
                    wx_media_id = voiceData[0].media_id;
                }
                fileJson.wx_media_id = wx_media_id;
                var result = yield FileService.createAsync(fileJson);
                console.log('++++++');
                console.log(result);
                this.body = {err: null, media_id: result._id, wx_media_id: wx_media_id};
            } catch (err) {
                logger.error('save file info err:' + err);
                this.body = {err: err, media_id: null, wx_media_id: null};
            }
            //var files = self.req.files;
            //for(var key in files){
            //    var file = files[key];
            //    var fileName = Math.random() + '.' + file.extension;
            //    var newPath = path.join(__dirname, '../../../public/qrCode',  fileName);
            //    console.log(newPath);
            //    fs.renameSync(file.path, newPath);  //重命名
            //}
        }
    });

};