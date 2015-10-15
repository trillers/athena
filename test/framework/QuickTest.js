var text = null;
var pureText = null;
var i = -1;

text = '你好！';
pureText = text.slice(0, -1);
console.log(text);
console.warn(pureText);
console.log('\r\n');

text = '你好！';
pureText = text.slice(0, text.length);
console.log(text);
console.log(pureText);
console.log('\r\n');

text = '你好！';
i = text.indexOf('！');
pureText = text.slice(0, i);
console.log(text);
console.log(pureText);
console.log('\r\n');



