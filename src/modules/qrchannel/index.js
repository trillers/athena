var QrHandlerDispatcher = require('./common/QrHandlerDispatcher');

var dispatcher = new QrHandlerDispatcher();

dispatcher.register(require('./handlers/StudentBindClazzHandler'));
dispatcher.register(require('./handlers/TeacherSubscribeHandler'));
//dispatcher.setNullHandler(require('./handlers/NullHandler'));
//dispatcher.setDefaultHandler(require('./handlers/DefaultHandler'));

module.exports = dispatcher;