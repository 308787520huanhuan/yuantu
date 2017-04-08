import util = require("../../scripts/util");
import _ = require('underscore');
import qs = require('qs');
import express = require('express');
import man = require('../scripts/manager');
var chart = require('chart');
import loginRetainSql = require('../mysql/loginRetainsql');

class LoginRetain {
    constructor() { }
    loginRetain(input: any, req: express.Request, res: express.Response): void {
        var loginRetainsql = new loginRetainSql();
        loginRetainsql.getActivepeople().then(data => {
            var labe = "";
            data.forEach(function (data1) {
                labe = labe + data1["month"] + ",";
            })
            if (labe.length > 0) {
                labe = labe.substr(0, labe.length - 1);
            }
            var dat= [];
            data.forEach(function (data2) {
                dat.push(data2["active"]);
            })
            loginRetainsql.getBornpople().then(data1 => {
                var label = "";
                data1.forEach(function(data1) {
                    label = label + data1["month"] + ",";
                })
                if (label.length > 0) {
                    label = label.substr(0, label.length - 1);
                }
                var datas = [];
                data1.forEach(function(data2) {
                    datas.push(data2["born"]);
                })
                res.render("pay-admin/app/loginRetain", { "session": req.session["user"], "option": label, "list": datas, "option0": labe, "list0": dat });
            })
       })  
    }

}
export =LoginRetain;