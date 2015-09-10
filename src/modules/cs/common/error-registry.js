var errorList =  [
      [ 3001,    '出发地有误']
    , [ 0,     '请求成功' ]
    , [ 3002, '目的地有误' ]
    , [ 3003, '乘车时间有误']
    ];

var errorMap = {};
errorList.forEach(function(v){
    errorMap[String(v[0])] = v[1];
});

module.exports = {
    list: errorList,
    map: errorMap
};
