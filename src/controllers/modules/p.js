module.exports=function(router){
    router.post('/validateIc', function* (){
        var data = this.query;
        var phone = data.phone;
        var ic = data.ic;
        console.log(data);
    })
}