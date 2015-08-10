module.exports = function(app){
    require('./api')(app);
    require('./modules')(app);
};
