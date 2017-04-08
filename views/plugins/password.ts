import util = require("../../scripts/util");
import _ = require('underscore');
import qs = require('qs');
import express = require('express');
import MyappListsql = require('../mysql/myappListsql');

class Password {

    constructor() {

    }

    password(input: any, req: express.Request, res: express.Response): void {
        res.render("pay-admin/home/passwd", { "session": req.session["user"] ,"err":""}); 
    }

    changePasswd(input: any, req: express.Request, res: express.Response): void {
        var newPassword = input.newPassword;
        var rePassword = input.rePassword;


        if (!newPassword || newPassword.length < 7 || newPassword.length > 20) {
            res.render("pay-admin/home/passwd", { "session": req.session["user"], "err": "请输入新密码，并且密码长度大于7小于20" });
            return;
        }

        if (rePassword != newPassword) {
            res.render("pay-admin/home/passwd", { "session": req.session["user"], "err": "确认密码和输入密码不一致" });
            return;
        }

        var myappListsql = new MyappListsql();
        myappListsql.updateUserPassWord(newPassword, req.session["user"]["ID"]).then(data=> {
            if (data["changedRows"] > 0) {
                res.render("pay-admin/home/passwd", { "session": req.session["user"], "err": "更新密码成功" });
            }
        });
    }
    
}
export =Password;
