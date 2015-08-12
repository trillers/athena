var assert = require("assert");
var cs = require('../services/CaseService');
var co = require('co')
describe('CustomerServer', function() {

    it('create case check the return', function (done) {
        var mock = {
            type: 'tx',
            desc: '从西二旗到回龙观',
            status: '',
            commissionerId: 'id1',
            responsibleId: 'id2',
            conversationId: 'id3',
            paymentMethod: '微信支付',
            cost: 16.5,
            useTime: new Date(),
            place: '孵化器2号楼旗杆处',
            evaluation: '好',
            subcase: 'id4',

        }
        co(function* (){
            console.log(111)
            var data = yield cs.create(mock);
            console.log(data);
            done();
        })



    });
})