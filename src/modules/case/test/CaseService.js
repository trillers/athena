var assert = require("assert");
var cs = require('../services/CaseService');
var co = require('co')
describe('CustomerServer', function() {
    var caseCar = {
        type: 'car',
        desc: '这是一个用车单',
        status: 'df',
        commissionerId: 'id1',
        commissionerPhone: '13208571443',
        responsibleId: 'id2',
        conversationId: 'id3',
        useTime: '02-0404',
        evaluation: '3.9',
        origin: '回龙观',
        destination: '西二旗',
        carType: 'kc',
    }, caseId;

    /**
     * does't throw
     */
    it('create', function (done) {
        co(function* (){
            var data = yield cs.create(caseCar);
            console.log('aaaaaaa');
            caseId = data._id;
            assert.ok(!data._id);
            done();
        }).catch(function(err){
            console.log(err)
        })
    });

    it('load', function (done) {
        co(function* (){
            var data = yield cs.load(caseId);
            assert.equal(data.evaluation, '3.9');
            done();
        }).catch(function(err){
            console.log(err);
        })
    });
})