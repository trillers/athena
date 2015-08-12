var assert = require("assert");
var cs = require('../services/CaseService');

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
            subcase: 'id4'
        }
        cs.create(id, function (err, data) {
            console.log(data);
            assert.ok(!err);
            assert.equal(data, 1);
            done();
        });
    });
})