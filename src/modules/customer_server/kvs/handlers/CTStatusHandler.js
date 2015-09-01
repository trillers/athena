var cskv = require('../CustomerServer');
var userkv = require('../../../user/kvs/User');
var wechatApi = require('../../../wechat/common/api').api;
var CaseStatusEnum = require('../../common/models/TypeRegistry').item('CaseStatus');
var caseService = require('../../../case/services/CaseService');
var redis = require('redis').createClient();

module.exports = function(message){
    var data = JSON.parse(message);
    var phone = data.phone,
        status = data.status,
        driverName = data.driverName,
        driverPhone = data.driverPhone,
        carLicensePlate = data.carLicensePlate,
        carModel = data.carModel,
        carType = data.carType,
        estimatedCost = data.estimatedCost,
        caseNo = data.caseNo,
        css;
    userkv.loadOpenIdByPhoneAsync(phone)
        .then(function(openId){
            return cskv.loadCSSByIdAsync(openId);
        })
        .then(function(data){
            css = data;
            var csOpenId = css.csId;
            return cskv.loadPlaceCaseAsync(csOpenId);
        })
        .then(function(data){
            var txCase = data.payload;
            txCase.status = status;
            txCase.driverName = driverName;
            txCase.driverPhone = driverPhone;
            txCase.carLicensePlate = carLicensePlate;
            txCase.carType = carType;
            txCase.carModel = carModel;
            txCase.estimatedCost = estimatedCost;
            txCase.arriveTime = arriveTime;
            txCase.caseNo = caseNo;
            try{
                yield caseService.createAsync(txCase);
            } catch (err){
                //todo
                var cancelInfo = {caseNo: caseNo, phone: phone};
                redis.publish('taxi cancel', JSON.stringify(cancelInfo));
                yield wechatApi.sendTextAsync(css.csId, '订单保存到数据库失败，已自动取消订单，请重新下单！');
                return;
            }
            yield cskv.delPlaceCaseAsync(css.csId);
            var replyToCustomer = '司机预计' + txCase.arriveTime + '分钟后到，请稍等。</br>'
                + '-------------------------------------'
                + '起点：        ' + txCase.origin + '</br>'
                + '终点：        ' + txCase.destination + '</br>'
                + '用车类型：     ' + txCase.carType + '</br>'
                + '司机电话：     ' + txCase.driverPhone + '</br>'
                + '车牌号：      ' + txCase.carLicensePlate + '</br>'
                + '车型：        ' + txCase.carModel + '</br>'
                + '预估费用：     ' + txCase.estimatedCost + '</br>';

            var replyToCustomerServer = '已接单' + '</br>'
                +'司机预计' + txCase.arriveTime + '分钟后到，请稍等。</br>'
                + '-------------------------------------'
                + '起点：        ' + txCase.origin + '</br>'
                + '终点：        ' + txCase.destination + '</br>'
                + '用车类型：     ' + txCase.carType + '</br>'
                + '司机电话：     ' + txCase.driverPhone + '</br>'
                + '车牌号：      ' + txCase.carLicensePlate + '</br>'
                + '车型：        ' + txCase.carModel + '</br>'
                + '预估费用：     ' + txCase.estimatedCost + '</br>';
            yield wechatApi.sendTextAsync(css.csId, replyToCustomerServer);
            yield wechatApi.sendTextAsync(css.initiator, replyToCustomer);
        })
        .catch(Error, function(err){
            console.log('call taxi response err:' + err);
        });
}
