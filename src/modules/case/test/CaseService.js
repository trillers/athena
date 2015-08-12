var assert = require("assert");
var cs = require('../services/CaseService');
var co = require('co')
describe('CustomerServer', function() {

    it('create test', function (done) {
        var mock = {
            type: 'tx',
            desc: '从西二旗到回龙观',
            status: 'up',
            commissionerId: 'id1',
            responsibleId: 'id2',
            conversationId: 'id3',
            paymentMethod: '微信支付',
            cost: 16.5,
            useTime: new Date(),
            place: '孵化器2号楼旗杆处',
            evaluation: '好',
            subcase: 'id4',
            origin: 'huilongguan',
            destination: 'xierqi',
            driverName: 'zhangsan',
            driverPhone: '138888888',
            carLicensePlate: '7777',
            carModel: '奔驰',
            mileage: 20
        }
        co(function* (){
            var data = yield cs.create(mock);
            assert.ok(true);
            done();
        }).catch(function(err){
            console.log(err)
        })
    });
})