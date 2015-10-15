var errorList =  [
      [ -1,    '系统繁忙，此时请开发者稍候再试']
    , [ 0,     '请求成功' ]
    , [ 40001, '获取access_token时AppSecret错误，或者access_token无效。请开发者认真比对AppSecret的正确性，或查看是否正在为恰当的公众号调用接口' ]
    ];

var errorMap = {};
errorList.forEach(function(v){
    errorMap[String(v[0])] = v[1];
});

module.exports = {
    list: errorList,
    map: errorMap
};
