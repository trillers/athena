var cp = require('copy-paste');
var fs = require('fs');
var readableStream = fs.createReadStream('/Users/henryleu/Downloads/adidas tui/impbcopy.m');
//var writableStream = fs.createWriteStream('/Users/henryleu/Downloads/adidas tui/clipboard.jpg')
//readableStream.pipe(writableStream);
var content = cp.copy(readableStream);
console.log(content);