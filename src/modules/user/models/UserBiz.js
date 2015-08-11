var mongoose = require('../../../app/mongoose');
var DomainBuilder = require('../../../framework/model/DomainBuilder');
var UserRole = require('../../common/models/TypeRegistry').item('UserRole');

var schema = DomainBuilder
    .i('UserBiz')
    .withBasis()
    .withCreatedOn()
    .withProperties({
        user: {type: String, ref: 'User', required: true}
        , nickName: {type: String, default: '匿名'}
        , phone: {type: String}
        , role: {type: String, enum: UserRole.valueList(), default: UserRole.RegularUser.value()}
        //, tag: [{type: String, ref: 'Tag'}]
    })
    .build();


module.exports.schema = schema;
module.exports.model = schema.model(true);