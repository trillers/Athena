var logger = require('../../../app/logging').logger;
var u = require('../../../app/util');
var Promise = require('bluebird');
var UserService = require('../../user/services/UserService');
var UserRole = require('../../common/models/TypeRegistry').item('UserRole');
var UserKv = require('../../user/kvs/User');
var Service = {};

Service.registryCS = function* (user) {
    var userUpdate = {
        role: UserRole.CustomerService.value()
    };
    try{
        yield UserService.updateAsync(user.id, userUpdate);
        return true;
    } catch (err){
        logger.error(err);
        return false;
    }

};

Service.registryAD = function* (user) {
    var userUpdate = {
        role: UserRole.Admin.value()
    };
    try{
        yield UserService.updateAsync(user.id, userUpdate);
        return true;
    } catch (err){
        logger.error(err);
        return false;
    }

};

Service = Promise.promisifyAll(Service);

module.exports = Service;


