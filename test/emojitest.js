/**
 * Created by henryleu on 11/10/15.
 */
var testEmoji = function(t){
    //var ranges = [
    //    '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
    //    '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
    //    '\ud83d[\ude80-\udeff]'  // U+1F680 to U+1F6FF
    //];
    //var re = new RegExp(ranges.join('|'), 'g');
    //var re = /[\u1f600-\u1f64f]/g;
    return /([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g.test(t);
    //return re.test(t);
};

var text = "翊可家💯";
console.log(text + ' ' + (testEmoji(text) ? ' includes emoji' : ' does not include emoji') );

text = "包三哥";
console.log(text + ' ' + (testEmoji(text) ? ' includes emoji' : ' does not include emoji') );