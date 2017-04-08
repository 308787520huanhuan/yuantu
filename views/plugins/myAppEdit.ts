import util = require("../../scripts/util");
import _ = require('underscore');
import qs = require('qs');
import express = require('express');
import man = require('../scripts/manager');
import myAppEditSql = require('../mysql/myAppEditsql');
import MyappListsql = require('../mysql/myappListsql');

class myappEdit {
    constructor() { }

    myAppAdd(input: any, req: express.Request, res: express.Response): void {
        var name = input.name;
        var loginUrl = input.loginUrl;
        var appName = input.appName;
        var secretKey = input.secretKey;
        var paybackUrl = input.paybackUrl;

        var pageObj = { "name": name, "loginUrl": loginUrl, "appName": appName, "secretKey": secretKey, "paybackUrl": paybackUrl };

        if (!appName || !secretKey || !paybackUrl || !name || !loginUrl ||
            name.length == 0 || loginUrl.length == 0 || appName.length == 0 || secretKey.length == 0 || paybackUrl.length == 0) {
            pageObj["err"] = "参数不正确";
            pageObj["session"] = req.session["user"];
            res.render("pay-admin/app/myAppEdit", pageObj);
            return;
        }

        var myAppEdit = new myAppEditSql();
        var gameid = input.gameid;
        if (!gameid) {
            gameid = 0;
        }

        myAppEdit.selectGameByOr(name, appName, gameid).then(data2=> {
            if (data2.length > 0) {
                var resultData = {};
                if (data2[0]["name"] == name) {
                    resultData["err"] = "游戏英文名字已经存在";
                }
                else {
                    resultData["err"] = "游戏中文名字已经存在";
                }
                resultData["session"] = req.session["user"];
                resultData["gameData"] = pageObj;
                resultData["gameData"]["ID"] = gameid;
                res.render("pay-admin/app/myAppEdit", resultData);
                return;
            }

            if (gameid == 0) {
                pageObj["userID"] = req.session["user"]["ID"];

                myAppEdit.insertData(pageObj).then(data => {
                    res.redirect("views/myappList/myapplist");
                });
            }
            else {
                pageObj["ID"] = gameid;
                myAppEdit.updateGameInfo(pageObj).then(data=> {
                    if (data["affectedRows"] > 0) {
                        res.redirect("views/myappList/myapplist");
                    }
                });
            }            
        });

    }

    myAppInfoById(input: any, req: express.Request, res: express.Response): void {
        var id = input.ID;

        var myAppEditsql = new myAppEditSql();
        myAppEditsql.selectGameInfo(id).then(data=> {
            data.forEach(per => {
                res.render("pay-admin/app/myAppEdit", { "gameData": per, "err": "", "session": req.session["user"] });
                return;
            })
        });
    }

    gotoAddMyApp(input: any, req: express.Request, res: express.Response): void {
        res.render("pay-admin/app/myAppEdit", { "err": "", "session": req.session["user"], "gameData": {}});
    }
    //删除游戏应用信息
    deleteMyGame(input: any, req: express.Request, res: express.Response): void {
        var id = input.ID;
        var myapplistSql = new MyappListsql();
        myapplistSql.deleteGameInfoById(id).then(data => {
            res.redirect("views/myappList/myapplist");
        });
    }
}
export =myappEdit
    ;