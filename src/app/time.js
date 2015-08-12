module.exports = {
    currentTime: function () {
        return new Date();
    },
    currentTimeMillis: function () {
        return new Date().getTime();
    },
    currentYear: function(){
        return new Date().getFullYear();
    },
    recentYears: function (range) {
        var year = this.currentYear();
        var years = [];
        for (var i = year - range; i <= year + range; i++) {
            years.push(i);
        }
        return years;
    },
    format: function(date, pattern){
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(pattern)) pattern = pattern.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(pattern)) pattern = pattern.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return pattern;
    }
};