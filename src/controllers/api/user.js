module.exports = function(router){
    router.get('/_:id', function *(){
        console.log(this.params);
        this.response.body = {'name': 'sunny', 'age': '24'};
    });
}
