var TypeRegistry = require('../../../framework/model/TypeRegistry');
var registry = new TypeRegistry('TypeRegistry', 'TypeRegistry', 'TypeRegistry');

registry
    .item('UserRole', 'UserRole', '用户角色')
    .addChild('SystemManager','sm', '系统管理员')
    .addChild('RegularUser','ru', '普通用户')
    .addChild('CustomerServer','cs', '客服')

module.exports = registry;