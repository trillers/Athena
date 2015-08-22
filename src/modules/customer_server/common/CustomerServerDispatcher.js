var cskv = require('../kvs/CustomerServer');
var redis = require('redis');
var Promise = require('bluebird');

var CustomerServerDispatcher = function(){
    this.handlers = {};
    this.defaultHandler = null;
    this.nullHandler = null;
    this.redisClient = redis.createClient();
    this.redisClientInit();
}

var prototype  = CustomerServerDispatcher.prototype;

prototype.redisClientInit = function(){
    var self = this;
    self.redisClient.subscribe('__keyevent@0__:expired');
    self.redisClient.on('message', self.handleRedisMessage.bind(self));
}

prototype.handleRedisMessage = function(channel, message){
    var key = message;
    var index = key.indexOf(':', key.indexOf(':'));
    console.log('handle expire');
    console.log(index);
    var prefix = key.slice(0, index);
    console.log('prefix======'+ prefix);
    var csId = key.slice(index);
    console.log(csId);
    cskv.delCSSByIdAsync(csId)
        .then(function(){
            return cskv.remWcCSSetAsync(csId);
        })
        .then(function(){
            cskv.saveCSStatusByCSOpenIdAsync(csId, 'of');
        })
        .catch(Error, function(err){
            console.log('reset cs error');
            console.log(err);
        });
}

prototype.register = function(handler){
    var key = handler.type;
    this.handlers[key] = handler;
};

prototype.setDefaultHandler = function(handler){
    this.defaultHandler = handler;
};

prototype.setNullHandler = function(handler){
    this.nullHandler = handler;
};

prototype.dispatch = function(user, message){
    var self = this;
    var role = user.role;
    var handler = self.handlers[role];
    console.log(role);
    handler && handler.handle(user, message);
}

module.exports = CustomerServerDispatcher;