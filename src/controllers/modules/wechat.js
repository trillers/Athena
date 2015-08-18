var settings = require('athena-settings');
var Frankon = require('../../framework/frankon');
var Router = require('koa-router');
var co = require('co');
var wechat = require('co-wechat');
var WechatOperationService = require('../../modules/wechat/services/WechatOperationService');
var QrChannelDispatcher = require('../../modules/qrchannel');
var UserKv = require('../../modules/user/kvs/User');
var CSDispatcher = require('../../modules/customer_server');
var productionMode = settings.env.mode == 'production';
var logger = require('../../app/logging').logger;
var tokenConfig = productionMode ? {
    token: settings.wechat.token,
    appid: settings.wechat.appKey,
    encodingAESKey: settings.wechat.encodingAESKey
} : settings.wechat.token;
var thunkify = require("thunkify")
var WechatAuthenticator = require('../../framework/WechatAuthenticator');
var authenticator = new WechatAuthenticator({});
var authEnsureSignin = thunkify(authenticator.ensureSignin);
var customerDispatcher = require('../../modules/customer_server');
var frankon = new Frankon();
module.exports = function() {
    var router = new Router();
    //require('../common/routes-wechat')(router);

    //frankon.use(function* (next) {
    //    //根据角色，分别派遣session，然后next
    //    var user = yield authEnsureSignin(this.weixin, this.req, this.res, next)
    //    WechatOperationService.logActionAysnc(this.weixin);
    //    customerDispatcher.dispatch(user, this.weixin, res);
    //
    //});

    //frankon.use(function* (next) {
    //    //根据消息类型分别处理
    //    //如果是用户消息，先查进行中的会话，有就发送
    //    //没有就查询待处理列表，没有就新建或者有就发送消息
    //
    //});

    var handler = function* () {
        //根据角色，分别派遣session，然后next
        var user = yield authEnsureSignin(this.weixin, this.req, this.res, next)
        WechatOperationService.logActionAysnc(this.weixin)
        customerDispatcher.dispatch(user, this.weixin, res);
    }

    //var handler = frankon.generateHandler();
    var wechatMiddleware = wechat(tokenConfig).middleware(handler);
    router.use('/wechat', wechatMiddleware);
    return router;
}