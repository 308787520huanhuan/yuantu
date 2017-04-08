"use strict";
var chart = require('chart');
const payGameInfoDetailsql = require("../mysql/payGameInfoDetailsql");
class PayGameInfoDetail {
    constructor() { }
    payGameInfoDetail(input, req, res) {
        var paygameInfoDetailSql = new payGameInfoDetailsql();
        paygameInfoDetailSql.getSumPeople().then(data0 => {
            var lab = "";
            data0.forEach(function (data1) {
                lab = lab + data1["month"] + ",";
            });
            if (lab.length > 0) {
                lab = lab.substr(0, lab.length - 1);
            }
            var dat = [];
            data0.forEach(function (data2) {
                dat.push(data2["uid"]);
            });
            paygameInfoDetailSql.getSumPrice().then(data => {
                var label = "";
                data.forEach(function (data1) {
                    label = label + data1["month"] + ",";
                });
                if (label.length > 0) {
                    label = label.substr(0, label.length - 1);
                }
                var datas = [];
                data.forEach(function (data2) {
                    datas.push(data2["price"]);
                });
                res.render("pay-admin/product/payGameInfoDetail", { "session": req.session["user"], "option": label, "list": datas, "option0": lab, "lit": dat });
            });
        });
    }
}
module.exports = PayGameInfoDetail;
//# sourceMappingURL=payGameInfoDetail.js.map