var domain = require('../domain');
var apiFactory = domain.restApi();

domain.action('getCvsSnapshot').onExecute(function(filter){
    apiFactory.get('/cvs/snapshot').drive(this).send();
});

domain.action('loadCvs').onExecute(function(filter){
    apiFactory.post('/cvs/find').drive(this).send({filter: filter});
});

domain.action('loadMsgOfCvs').onExecute(function(cvsId){
    apiFactory.get('/msg/_' + cvsId).drive(this).send();
});

domain.action('getCsSnapshot').onExecute(function(filter){
    apiFactory.get('/cs/snapshot').drive(this).send({filter: filter});
});

domain.action('loadCs').onExecute(function(){
    apiFactory.get('/cs/find').drive(this).send();
});

domain.action('delCs').onExecute(function(openId){
    apiFactory.get('/cs/del').drive(this).send({openId:openId});
});

domain.action('getCustomerSnapshot').onExecute(function(){
    apiFactory.get('/customer/snapshot').drive(this).send();
});

domain.action('loadCustomer').onExecute(function(){
    apiFactory.get('/customer/find').drive(this).send();
});

domain.action('loadAssistant').onExecute(function(){
    apiFactory.get('/assistant/loadAll').drive(this).send();
});

domain.action('loadAssistantById').onExecute(function(id){
    apiFactory.get('/assistant/loadOne?id=' + id).drive(this).send();
});

domain.action('loadAssistantContacts').onExecute(function(bot_id){
    apiFactory.get('/assistant/contacts?bot_id=' + bot_id).drive(this).send();
});

domain.action('loadAssistantGroups').onExecute(function(botId){
    apiFactory.get('/assistant/groups?botId=' + botId).drive(this).send();
});

domain.action('loadCustomerById').onExecute(function(id){
    apiFactory.get('/customer/load?id=' + id).drive(this).send();
});

domain.action('getBatchMsg').onExecute(function(botId, type){
    apiFactory.get('/assistant/getBatchMsg?botId=' + botId + '&type=' + type).drive(this).send();
});

domain.action('sendMsgToCustomer').onExecute(function(data){
    apiFactory.post('/customer/sendMsg').drive(this).send(data);
});

domain.action('assistantMass').onExecute(function(data){
    apiFactory.post('/assistant/mass').drive(this).send(data);
});

domain.action('loadAdmins').onExecute(function(){
    apiFactory.get('/sys_user/loadAll').drive(this).send();
});

domain.action('addAdmin').onExecute(function(data){
    apiFactory.post('/sys_user/add').drive(this).send(data);
});

domain.action('updateAdmin').onExecute(function(data){
    apiFactory.post('/sys_user/update').drive(this).send(data);
});

domain.action('uploadImg').onExecute(function(data){
    apiFactory.post('/file/upload').drive(this).send(data);
});

domain.action('asyncAssistant').onExecute(function(data){
    apiFactory.post('/assistant/async').drive(this).send(data);
});

module.exports = null;