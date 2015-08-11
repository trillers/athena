var EnumType = require('./EnumType');

var LifeFlag = new EnumType([
    {
        value: 'a',
        name: 'Active',
        text: '已激活'
    },
    {
        value: 'i',
        name: 'Inactive',
        text: '已锁定'
    },
    {
        value: 'd',
        name: 'Deleted',
        text: '已删除'
    }
]);
var UserState = new EnumType([
    {
        value: 'a',
        name: 'Anonymous',
        text: '匿名'
    },
    {
        value: 'r',
        name: 'Registered',
        text: '已注册'
    },
    {
        value: 'v',
        name: 'Verified',
        text: '已验证'
    }
]);
module.exports = {
    LifeFlag: LifeFlag,
    UserState: UserState
};