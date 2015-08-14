var TypeRegistry = require('../../../framework/model/TypeRegistry');
var registry = new TypeRegistry('TypeRegistry', 'TypeRegistry', 'TypeRegistry');

registry
    .item('UserRole', 'UserRole', '用户角色')
    .addChild('SystemManager','sm', '系统管理员')
    .addChild('RegularUser','ru', '普通用户')
    .addChild('CustomerServer','cs', '客服')
    .up().item('Case', 'Case', '标准化服务')
    .addChild('Coffee','co', '咖啡')
    .addChild('Taxi','tx', '用车')
    .up().item('CaseStatus', 'CaseStatus', '服务类型')
    .addChild('UnPay','up', '未支付')
    .addChild('Payed','pd', '已支付')
    .addChild('Handle','hl', '处理中')
    .addChild('Serving','sv', '派送中')
    .addChild('Complete','cp', '已完成')
    .addChild('Close','cl', '已关闭')
    .addChild('Cancel','ca', '已作废')
    .up().item('MsgContent', 'MsgContent', '消息类型')
    .addChild('Text','tx', '文本')
    .addChild('Voice','vo', '语音')
    .addChild('Pic','pi', '图片')
    .up().item('Party', 'Party', '方')
    .addChild('Org','og', '机构')
    .addChild('Person','pr', '个人')
    .up().item('ConversationState', 'ConversationState', '会话状态')
    .addChild('Text','tx', '待处理')
    .addChild('Voice','vo', '进行中')
    .addChild('Pic','pi', '已结束')


module.exports = registry;