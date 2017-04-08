"use strict";
const MyappListsql = require("../mysql/myappListsql");
class myAppList {
    constructor() {
    }
    myapplist(input, req, res) {
        var appName = input.appName ? input.appName : "";
        var myappListsql = new MyappListsql();
        myappListsql.queryGameInfoNum(appName, req.session["user"]["ID"]).then(data1 => {
            var pager = {};
            var pagecount = (parseInt(data1[0]["num"] / 10 + "") + (data1[0]["num"] % 10 > 0 ? 1 : 0));
            pager.pageCount = pagecount;
            pager.pageCurrent = input.current ? input.current : 1;
            pager.maxNum = data1[0]["num"];
            pager.pagePath = "myapplist?";
            myappListsql.queryGameList(appName, req.session["user"]["ID"], (pager.pageCurrent - 1) * 10, 10).then(data => {
                res.render('pay-admin/app/myAppList', { "session": req.session["user"], "list": data, "option": data, "pager": pager, "appName": appName });
            });
        });
    }
}
module.exports = myAppList;
//# sourceMappingURL=myappList.js.map