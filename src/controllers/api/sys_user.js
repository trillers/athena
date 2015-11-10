var systemUserService = require('../../modules/system_user/services/SystemUserService');
var LifeFlag = require('../../framework/model/enums').LifeFlag;
var util = require('../../app/util');

module.exports = function(router){
    router.post('/add', function *(){
        var username = this.request.body.username;
        var password = this.request.body.password;
        var token = util.generateToken(password);

        var sys_user = {
            username: username,
            token: token
        }
        try {
            yield systemUserService.createAsync(sys_user);
            this.body = {success: true};
        } catch(e){
            console.log('add system user err: ' + e);
            this.body = {success: false};
        }
    });

    router.get('/loadAll', function *(){
        try {
            var admins = yield systemUserService.findAsync({});
            for(var i = 0; i < admins.length; i++){
                admins[i].lFlg = LifeFlag.text(admins[i].lFlg);
            }
            this.body = admins;
        } catch(e){
            console.log('load all system user err: ' + e);
            this.body = null;
        }
    });

    router.post('/update', function *(){
        try {
            var action = this.request.body.action;
            var id = this.request.body.id || this.session.user._id;
            if(action === 'modifyPassword'){
                var token = util.generateToken(this.request.body.password);
                var update = {
                    token: token
                }
                yield systemUserService.updateAsync(id, update);
            }
            if(action === 'lockUser'){
                var update = {
                    lFlg: LifeFlag.Inactive
                }
                yield systemUserService.updateAsync(id, update);
            }
            if(action === 'activeUser'){
                var update = {
                    lFlg: LifeFlag.Active
                }
                yield systemUserService.updateAsync(id, update);
            }
            this.body = {success: true};
        } catch(e){
            console.log('update system user err: ' + e);
            this.body = {success: false};
        }
    });
}
