import util = require("../../scripts/util");
import _ = require('underscore');
import qs = require('qs');
import express = require('express');
import man = require('../scripts/manager');
import MyappListsql = require('../mysql/myappListsql');

//页数接口
interface Pager {
    pageCount: number;
    pageCurrent: number;
    maxNum: number;
    pagePath: string;
}

class myAppList {

    constructor() {

    }

    myapplist(input: any, req: express.Request, res: express.Response): void {
        var appName = input.appName ? input.appName : "";
        var myappListsql = new MyappListsql();
        myappListsql.queryGameInfoNum(appName, req.session["user"]["ID"]).then(data1 => {
            var pager = <Pager> {};
            var pagecount = (parseInt(data1[0]["num"] / 10 + "") + (data1[0]["num"] % 10 > 0 ? 1 : 0));
            pager.pageCount = pagecount;
            pager.pageCurrent = input.current ? input.current : 1;
            pager.maxNum = data1[0]["num"];
            pager.pagePath = "myapplist?";
            myappListsql.queryGameList(appName, req.session["user"]["ID"], (pager.pageCurrent - 1) * 10, 10).then(data => {

                   res.render('pay-admin/app/myAppList', { "session": req.session["user"], "list": data, "option": data, "pager": pager, "appName": appName});
               
            });

        });
    }

}
export =myAppList;