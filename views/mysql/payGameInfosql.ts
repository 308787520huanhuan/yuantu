import util = require("../../scripts/util");
import _ = require('underscore');
import qs = require('qs');
import db = require('../../scripts/db');
import express = require('express');
import pm = require('../scripts/manager');

class PayGameInfo {

    constructor() { }

    getDB(): db.Pool {
        return pm.handle().platform_db;
    }


    //统计支付信息表的行数
    queryPayGameInfoNum(game: any, platform: any, time: string): Promise<Array<any>> {
        var sql = "select count(*) as num from pay_event where game like '%" + game + "%' and platform like '%" + platform + "%' and time like '%" + time + "%'";
        return this.getDB().selectBySql(sql);
    }

   //用于支付信息的分页
    queryPayGameList(game: string,platform:any, startPos: any, pageNum: any): Promise<Array<any>> {
        var sql = "select *from pay_event where game like '%" + game + "%' and platform like '%"+ platform+"%' limit " + startPos + "," + pageNum;
        return this.getDB().selectBySql(sql);
    }

    //用于平台去重

    distinctPlatform(): Promise<Array<any>> {
        var sql = "select distinct platform from pay_event";
        return this.getDB().selectBySql(sql);
    }

    //用于游戏去重
    disinctGame(): Promise<Array<any>> {
        var sql = "select distinct game from pay_event";
        return this.getDB().selectBySql(sql);
    }
}
export =PayGameInfo;