module.exports = function* (next){
    /*
        can obtain more information base in location
        for example,obtain users online shotSnap
        this middleware refresh this user
        analise the list and emit online and offline
    */
    if(LocationEvtOrNot(this.weixin)){
        console.log('have not enable')
    }

    yield next;
}
function LocationEvtOrNot(msg){
    return msg.MsgType == 'event' && msg.Event.toLowerCase() === 'location'
}