"use strict";
const Loginsql = require("../mysql/loginsql");
class rightNow {
    constructor() {
    }
    login(input, req, res) {
        var userName = input.userName;
        var passWord = input.passWord;
        var auth = input.auth ? input.auth : "";
        if (!userName || !passWord) {
            res.render("pc/index", { "userName": "", "passWord": "", "err": "" });
            return;
        }
        var loginsql = new Loginsql();
        loginsql.checkLoginAccount(userName).then(data => {
            var passWordSql = data[0];
            if (passWordSql && passWordSql["password"] == passWord) {
                req.session["user"] = passWordSql;
                res.render('pay-admin/home/index', { "session": req.session["user"], "auth": auth });
            }
            else {
                res.render("pay-admin/login", { "userName": userName, "passWord": passWord, "err": "用户名或者密码不正确" });
            }
        });
    }
}
module.exports = rightNow;
//# sourceMappingURL=rightNow.js.map