var assert = require('assert');
var request = require('request');
var fs = require('fs');

//describe('file upload', function(){
//   it('success upload file', function(done){
//       var formData = {
//           file: fs.createReadStream(__dirname + '/test.png')
//       }
//       request.post({url:'http://localhost:3020/api/file/upload', formData: formData}, function optionalCallback(err, httpResponse, body) {
//           console.log(err);
//           console.log(body);
//           assert.ok(!err);
//           assert.ok(JSON.parse(body).media_id);
//           done();
//       });
//   });
//
//});

describe('get file', function(){
    var media_id = '';
    before(function(done){
        var formData = {
            file: fs.createReadStream(__dirname + '/test.png')
        }
        request.post({url:'http://localhost:3020/api/file/upload', formData: formData}, function optionalCallback(err, httpResponse, body) {
            console.log(err);
            assert.ok(!err);
            var data = JSON.parse(body);
            assert.ok(data.media_id);

            media_id = data.media_id
            done();
        });
    })
    it('success get file', function(done){
        var url = 'http://localhost:3020/api/file/?media_id=' + media_id;
        request(url, function(error, response, body){
            assert.ok(!error);
            console.log(body);
            done();
        })
    })
})
