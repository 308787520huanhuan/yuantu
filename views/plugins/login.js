"use strict";
const UserAuthsSql = require("../mysql/userAuthsSql");
const UserSql = require("../mysql/userSql");
const https = require("https");
function httpsGet(_url, callback) {
    https.get(_url, res => {
        var recv = "";
        res.on('data', function (data) {
            recv += data;
        });
        res.on('end', function () {
            callback(recv);
        });
    });
}
class Login {
    constructor() {
    }
    // login(input: any, req: express.Request, res: express.Response): void {
    //     var userName = input.userName;
    //     var passWord = input.passWord;
    //     var auth = input.auth ? input.auth : "";
    //     if (!userName || !passWord) {
    //         res.render("pc/index", { "userName": "", "passWord": "", "err": "" });
    //         return;
    //     }
    //     var loginsql = new Loginsql();
    //     loginsql.checkLoginAccount(userName).then(data => {
    //             var passWordSql = data[0];
    //             if (passWordSql && passWordSql["password"] == passWord) {
    //                 req.session["user"] = passWordSql;
    //                 res.render('pay-admin/home/index', { "session": req.session["user"], "auth": auth });
    //             }
    //             else {
    //                 res.render("pay-admin/login", { "userName": userName, "passWord": passWord, "err": "用户名或者密码不正确" });
    //             }
    //         });
    // }
    // loginOut(input: any, req: express.Request, res: express.Response): void {
    //     req.session["user"] = null;
    //     res.render('pay-admin/login', { "err": "", "userName": "", "passWord": "",});
    // }
    _checkForm(input, req, res) {
        var source = input.source;
        var identifier = input.identifier;
        var credential = input.credential;
        if (!identifier) {
            res.render("pc/index", { "identifier": "", "credential": "", "err": "用户名不能为空" });
            return false;
        }
        else if (identifier.length < 6 || identifier.length > 16) {
            res.render("pc/index", { "identifier": "", "credential": "", "err": "用户名长度必须是6-16" });
            return false;
        }
        if (!credential) {
            res.render("pc/index", { "identifier": "", "credential": "", "err": "密码不能为空" });
            return false;
        }
        else if (credential.length < 6 || credential.length > 16) {
            res.render("pc/index", { "identifier": "", "credential": "", "err": "密码长度必须是6-16" });
            return false;
        }
        return true;
    }
    _weixinAuthLogin(input, req, res) {
        //检查用户是否已经登录
        var user = req.session['user'];
        var code = input.code;
        var appId = "wx9d877ae5809a128c";
        var appSecret = "121bd26fe09847798c5cacd5da270e7a";
        var url = "https://api.weixin.qq.com/sns/oauth2/access_token?" +
            "appid=" + appId +
            "&secret=" + appSecret +
            "&code=" + code +
            "&grant_type=authorization_code";
        httpsGet(url, (data) => {
            var dataobj = JSON.parse(data);
            if (dataobj["errcode"]) {
                res.send({ "result": dataobj["errcode"], "message": dataobj['errmsg'] });
                return;
            }
            var openid = dataobj['openid'];
            var source = 2 /* weixin */;
            var access_token = dataobj['access_token'];
            var userAuthsql = new UserAuthsSql();
            userAuthsql.getUserAuthsBySourceAndOId(source, openid).then(userAuths => {
                var usersql = new UserSql();
                var userAuth = userAuths[0];
                if (userAuth) {
                    usersql.getUsers(userAuth["user_id"]).then(users => {
                        var user = users[0];
                        if (user) {
                            req.session['user'] = user;
                            res.send({ "result": 0, "message": "用户登录成功", "uid": user['id'] });
                        }
                        else {
                            res.send({ "result": 1, "message": "用户不存在" + userAuth["user_id"] });
                        }
                    });
                }
                else {
                    //第一次授权
                    var url = "https://api.weixin.qq.com/sns/userinfo?access_token=" + access_token + "&openid=" + openid + "&lang=zh_CN";
                    httpsGet(url, (data) => {
                        var dataobj = JSON.parse(data);
                        if (dataobj["errcode"]) {
                            res.send({ "result": dataobj["errcode"], "message": dataobj['errmsg'] });
                            return;
                        }
                        user = { nickname: dataobj.nickname, sex: dataobj.sex, avator: dataobj.headimgurl };
                        usersql.insertData(user).then(user => {
                            req.session['user'] = user;
                            userAuth = { user_id: user['id'], oid: openid, source: source };
                            userAuthsql.insertData(userAuth);
                            res.send({ "result": 0, "message": "用户登录成功", "uid": user['id'] });
                        });
                    });
                }
            });
        });
    }
    _qqAuthLogin(input, req, res) {
    }
    _weiboAuthLogin(input, req, res) {
    }
}
module.exports = Login;
//# sourceMappingURL=login.js.map