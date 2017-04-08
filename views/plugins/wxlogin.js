"use strict";
const util = require("../../scripts/util");
class wxlogin {
    constructor() { }
    login(input, req, res) {
        var appid = "wx9d877ae5809a128c";
        var secret = "121bd26fe09847798c5cacd5da270e7a";
        util.httpGet("https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + appid + "&secret=" + secret + "&code=" + input.code + "&grant_type=authorization_code", function (data) {
            if (JSON.parse(data).errcode) {
                res.write("needlogin");
            }
            else {
                util.httpGet("https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=" + appid + "&grant_type=refresh_token&refresh_token=" + JSON.parse(data).refresh_token, function (data1) {
                    if (JSON.parse(data1).errcode) {
                        res.write("needlogin");
                    }
                    else {
                        util.httpGet("https://api.weixin.qq.com/sns/userinfo?access_token=" + JSON.parse(data1).access_token + "&openid=" + JSON.parse(data1).openid + "&lang=zh_CN", function (data2) {
                            //用户信息 实例
                            // {
                            // "openid":" OPENID",
                            // " nickname": NICKNAME,
                            // "sex":"1",
                            // "province":"PROVINCE"
                            // "city":"CITY",
                            // "country":"COUNTRY",
                            //     "headimgurl":    "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/46", 
                            //     "privilege":[
                            //     "PRIVILEGE1"
                            //     "PRIVILEGE2"
                            //     ],
                            //     "unionid": "o6_bmasdasdsad6_2sgVt7hMZOPfL"
                            // }
                        });
                    }
                });
            }
        });
    }
}
module.exports = wxlogin;
//# sourceMappingURL=wxlogin.js.map