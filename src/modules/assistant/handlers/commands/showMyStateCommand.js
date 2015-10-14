var wechatApi = require('../../../wechat/common/api').api;
var userRole = require('../../../common/models/TypeRegistry').item('UserRole');
var csState = require('../../../common/models/TypeRegistry').item('CSState');
var cskv = require('../../../cs/kvs/CustomerService');
var co = require('co');
module.exports = function(context){
    var message = context.weixin;
    var reply = '';
    //response [系统]:您的当前状态为-在线-会话中
    co(function* (){
        try {
            var user = yield context.getUser();
            reply = '[系统]:您的角色为' + userRole.values(user.role);
            if(user.role === userRole.CustomerService.value()){
                var stat = yield cskv.loadCSStatusByCSOpenIdAsync(message.FromUserName);
                if(typeof stat === 'string'){
                    reply += ' 当前状态为: ' + csState.values(stat);
                }
                else{
                    reply += ' 当前状态为: ' + csState.offline.title();
                }
            }
            yield wechatApi.sendTextAsync(message.FromUserName, reply);
        }catch(e){
            console.log(e);
        }
    })
};