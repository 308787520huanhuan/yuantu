import util = require("../../scripts/util");
import _ = require('underscore');
import qs = require('qs');
import express = require('express');
import man = require('../scripts/manager');
import Loginsql = require('../mysql/loginsql');

class rightNow {
    constructor() {

    }

    login(input: any, req: express.Request, res: express.Response): void {
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

export = rightNow;