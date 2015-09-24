var util = require('util');
var logger = require('../../app/logging').logger;
var FileService = require('../../modules/file/services/FileService');
var fs = require('fs');
var path = require('path');
var thunkify = require('thunkify');

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
            self.body = fs.readFileSync(file.path);
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
        console.log(this);
        console.log(self.req.body);
        console.log(self.req.files);
        var file = self.req.files.file;
        var fileJson = {
            name: file.name,
            ext: file.extension,
            size: file.size,
            path: file.path,
            mimeType: file.mimetype
        }
        try{
            var result = yield FileService.createAsync(fileJson);
            console.log('++++++');
            console.log(result);
            this.body = {err: null, media_id: result._id};
        } catch(err){
            logger.err('save file info err:' + err);
            this.body = {err: err, media_id: null};
        }
        //var files = self.req.files;
        //for(var key in files){
            //var file = files[key];
            //var fileName = Math.random() + '.' + file.extension;
            //var newPath = path.join(__dirname, '../../../public/qrCode',  fileName);
            //console.log(newPath);
            //fs.renameSync(file.path, newPath);  //重命名
        //}
    });

};