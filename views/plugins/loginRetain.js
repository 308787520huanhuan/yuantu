"use strict";
var chart = require('chart');
const loginRetainSql = require("../mysql/loginRetainsql");
class LoginRetain {
    constructor() { }
    loginRetain(input, req, res) {
        var loginRetainsql = new loginRetainSql();
        loginRetainsql.getActivepeople().then(data => {
            var labe = "";
            data.forEach(function (data1) {
                labe = labe + data1["month"] + ",";
            });
            if (labe.length > 0) {
                labe = labe.substr(0, labe.length - 1);
            }
            var dat = [];
            data.forEach(function (data2) {
                dat.push(data2["active"]);
            });
            loginRetainsql.getBornpople().then(data1 => {
                var label = "";
                data1.forEach(function (data1) {
                    label = label + data1["month"] + ",";
                });
                if (label.length > 0) {
                    label = label.substr(0, label.length - 1);
                }
                var datas = [];
                data1.forEach(function (data2) {
                    datas.push(data2["born"]);
                });
                res.render("pay-admin/app/loginRetain", { "session": req.session["user"], "option": label, "list": datas, "option0": labe, "list0": dat });
            });
        });
    }
}
module.exports = LoginRetain;
//# sourceMappingURL=loginRetain.js.map