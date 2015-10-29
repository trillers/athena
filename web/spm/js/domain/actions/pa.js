var domain = require('../domain');
var apiFactory = domain.restApi();

domain.action('getCvsSnapshot').onExecute(function(){
    apiFactory.get('/cvs/snapshot').drive(this).send();
});

domain.action('loadCvs').onExecute(function(filter){
    apiFactory.post('/cvs/find').drive(this).send({filter: filter});
});


module.exports = null;