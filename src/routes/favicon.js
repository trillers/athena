var path = require('path');
var fs = require('fs');
var thunkify = require('thunkify');
var read = thunkify(fs.readFile);

module.exports = function(app){
    app.use(function *(next){
        if('/favicon.ico' !== this.path) return yield next;

        var icon = yield read(path.join(__dirname, '../../public/favicon.ico'));
        this.set('Cache-Control', 'max-age = 3600');
        this.type = 'image/x-icon';
        this.response.body = icon;
    })
};