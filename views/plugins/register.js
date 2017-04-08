"use strict";
const request = require("request");
const UserSql = require("../mysql/userSql");
// import UserAuthsSql = require("../mysql/userAuthsSql");
class Register {
    _checkForm(input, req, res) {
        var identityType = input.identityType;
        var identifier = input.identifier;
        var credential = input.credential;
        if (!identifier) {
            return { "result": -3, "message": "用户名不能为空" };
        }
        else if (identifier.length < 6 || identifier.length > 16) {
            return { "result": -3, "message": "用户名长度必须是6-16" };
        }
        if (!credential) {
            return { "result": -3, "message": "密码不能为空" };
        }
        else if (credential.length < 6 || credential.length > 16) {
            return { "result": -3, "message": "密码长度必须是6-16" };
        }
        return { "result": -3, "message": "" };
    }
    /////////////////////////////////////////////////////////////
    //极光短信验证
    /////////////////////////////////////////////////////////////
    //获取验证码
    getCode(input, req, res) {
        var identifier = input.identifier;
        var data = {
            mobile: identifier,
            temp_id: "*"
        };
        req.session['msg_id'] = null;
        //curl --insecure -X POST -v https://api.sms.jpush.cn/v1/codes -H "Content-Type: application/json" -u "74a723422d4871d9b620d534:75d3fb7222557ff77f4012b0" -d '{"mobile":"18123360929","temp_id":*}'
        request.post("https://api.sms.jpush.cn/v1/codes", {
            'auth': {
                'user': '74a723422d4871d9b620d534',
                'pass': '75d3fb7222557ff77f4012b0',
                'sendImmediately': false
            },
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            'json': data,
            'strictSSL': false
        }, (error, response, body) => {
            if (body['msg_id']) {
                req.session['msg_id'] = body['msg_id'];
            }
        });
    }
    _checkCode(input, req, res, callback) {
        var identifier = input.identifier;
        var code = input.code;
        var msgId = req.session['msg_id'];
        if (msgId == null) {
            callback(false);
            return;
        }
        var data = {
            'code': code,
        };
        request.post("https://api.sms.jpush.cn/v1/codes/" + msgId + "/valid", {
            'json': data,
            'strictSSL': false
        }, (error, response, body) => {
            callback(body['is_valid']);
        });
    }
    //手机注册
    //result:{0已登录，1注册成功，-1注册类型错误，-2验证码错误}
    mobileRegister(input, req, res) {
        var identityType = input.identityType;
        var identifier = input.identifier;
        var credential = input.credential;
        var code = input.code; //验证码
        //目前只支持手机号码注册
        if (identityType != "mobile") {
            res.send({ "result": -1, "message": "注册类型错误" });
        }
        //用户已经登录
        if (req.session["user"]) {
            res.send({ "result": 0, "message": "用户已登录" });
            return;
        }
        // //验证验证码，获得的验证码，存储在session中，20分钟失效。
        // if (req.session[identifier] != code) {
        //     res.send({"result":-2,"message":"验证码错误"});
        // }
        if (this._checkForm(input, req, res)) {
            this._checkCode(input, req, res, (valid) => {
                if (!valid) {
                    res.send({ "result": -2, "message": "验证码错误" });
                    return;
                }
                var usersql = new UserSql();
                usersql.insertData({}).then(data => {
                    var identifier = input.identifier;
                    var credential = input.credential;
                    // var userAuthsql = new UserAuthsSql();
                    // userAuthsql.insertData({user_id:data['id'],identifier:identifier,identityType:identityType,credential:credential}).then(data => {
                    // res.send({"result":1,"message":"注册成功"});
                    //})
                });
            });
        }
    }
}
module.exports = Register;
//# sourceMappingURL=register.js.map