var systemUserService = require('../../modules/system_user/services/SystemUserService');
var util = require('../../app/util');

module.exports = function(router){
    require('../../app/routes-spa')(router);

    router.get('/', function *(){
        if(!this.session.user){
            this.redirect('/login');
        }else{
            yield this.render('index');
        }
    });
    router.get('/login', function *(){
        yield this.render('login');
    });
    router.post('/login', function *(){
        var username = this.request.body.username;
        var password = this.request.body.password;
        var token = util.generateToken(password);
        var res = {};
        try{
            var user = yield systemUserService.findOneAsync({username: username, token: token, lFlg: 'a'});
            if(user){
                this.session.user = user;
                res.success = true;
            }else{
                res.success = false;
            }
        }catch(err){
            console.log('query admin err in login router, err: ' + err);
            res.success = false;
        }
        this.body = res;
    });
    router.get('/logout', function *(){
        this.session.user = null;
        this.body = null;
    });
};