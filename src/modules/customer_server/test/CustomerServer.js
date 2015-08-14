var assert = require("assert");
var cskv = require('../kvs/CustomerServer');

describe('CustomerServer', function(){
    var csId = 'ABC7', csOpenId = '4x88adf888dddd88dd', openId = 'rrrrrrrr',
        wcCss = {csId: csOpenId, type: 'wc', openId: openId, expire: '33333'},
        pcCss = {csId: csId, type: 'pc', openId: openId, expire: '44444'},
        con = {from: openId, conId: '123'};


    it('saveCSStatusByCSId', function(done){
        cskv.saveCSStatusByCSId(csId, 'ol', function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data, 'ol');
            done();
        });
    });

    it('loadCSStatusByCSId', function(done){
        cskv.loadCSStatusByCSId(csId, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data, 'ol');
            done();
        });
    });

    it('delCSStatusByCSId', function(done){
        cskv.delCSStatusByCSId(csId, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data, 1);
            done();
        });
    })

    it('saveCSStatusByCSOpenId', function(done){
        cskv.saveCSStatusByCSOpenId(csOpenId, 'ol', function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data, 'ol');
            done();
        });
    });

    it('loadCSStatusByCSOpenId', function(done){
        cskv.loadCSStatusByCSOpenId(csOpenId, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data, 'ol');
            done();
        });
    });

    it('delCSStatusByCSOpenId', function(done){
        cskv.delCSStatusByCSOpenId(csOpenId, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data, 1);
            done();
        });
    });

    it('pc saveCSSById', function(done){
        cskv.saveCSSById(openId, csId, pcCss, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data, pcCss);
            done();
        });
    });

    it('pc loadCSSById', function(done){
        cskv.loadCSSById(csId, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data.csId, pcCss.csId);
            assert.equal(data.type, pcCss.type);
            assert.equal(data.openId, pcCss.openId);
            assert.equal(data.expire, pcCss.expire);
            done();
        });
    });


    it('pc delCSSById csId', function(done){
        cskv.delCSSById(csId, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data, 1);
            done();
        });
    });

    it('wc saveCSSById', function(done){
        cskv.saveCSSById(openId, csId, wcCss, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data, wcCss);
            done();
        });
    });

    it('pc loadCSSById', function(done){
        cskv.loadCSSById(openId, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data.csId, wcCss.csId);
            assert.equal(data.type, wcCss.type);
            assert.equal(data.openId, wcCss.openId);
            assert.equal(data.expire, wcCss.expire);
            done();
        });
    });


    it('pc delCSSById', function(done){
        cskv.delCSSById(openId, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data, 1);
            done();
        });
    });

    it('pushCSSetByCSId', function(done){
        cskv.pushCSSetByCSId(csId, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data, csId);
            done();
        });
    });

    it('loadCSSetByCSId', function(done){
        cskv.loadCSSetByCSId(csId, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data[0], csId);
            done();
        });
    });

    it('popCSSetByCSId', function(done){
        cskv.popCSSetByCSId(csId, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data, csId);
            done();
        });
    });

    it('delCSSetByCSId', function(done){
        cskv.delCSSetByCSId(csId, function(err, data){
            console.log(data);
            assert.ok(!err);
            done();
        });
    });

    it('pushCSSetByCSOpenId', function(done){
        cskv.pushCSSetByCSOpenId(csOpenId, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data, csOpenId);
            done();
        });
    });

    it('loadCSSetByCSOpenId', function(done){
        cskv.loadCSSetByCSOpenId(csOpenId, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data[0], csOpenId);
            done();
        });
    });

    it('popCSSetByCSOpenId', function(done){
        cskv.popCSSetByCSOpenId(csOpenId, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data, csOpenId);
            done();
        });
    });

    it('delCSSetByCSOpenId', function(done){
        cskv.delCSSetByCSOpenId(csOpenId, function(err, data){
            console.log(data);
            assert.ok(!err);
            done();
        });
    });

    it('pushConQueue', function(done){
        var scon = JSON.stringify(con);
        cskv.pushConQueue(scon, function(err, data){
            console.log(data);
            assert.ok(!err);
            assert.equal(data, scon);
            done();
        });
    });

    it('loadConQueue', function(done){
        cskv.loadConQueue(function(err, data){
            console.log(data);
            assert.ok(!err);
            var conObj = JSON.parse(data[0]);
            assert.equal(conObj.from, con.from);
            assert.equal(conObj.conId, con.conId);
            done();
        });
    });

    it('popConQueue', function(done){
        cskv.popConQueue(function(err, data){
            console.log(data);
            assert.ok(!err);
            var conObj = JSON.parse(data);
            assert.equal(conObj.from, con.from);
            assert.equal(conObj.conId, con.conId);
            done();
        });
    });

    it('delCSSetByCSOpenId', function(done){
        cskv.delConQueue(function(err, data){
            console.log(data);
            assert.ok(!err);
            done();
        });
    });
});