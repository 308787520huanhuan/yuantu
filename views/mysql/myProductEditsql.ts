import util = require("../../scripts/util");
import _ = require('underscore');
import qs = require('qs');
import db = require('../../scripts/db');
import express = require('express');
import pm = require('../scripts/manager');

class myProductEditSql {

    constructor() { }

    getDB(): db.Pool {
        return pm.handle().platform_info_db;
    }
    //插入数据
    insertData(param: any): Promise<any[]> {
        return this.getDB().insertObject(param, "platform");
    }
    //通过用户选择游戏
    selectGameByUserID(id: any): Promise<any[]> {
        return this.getDB().select("game", "userID", id);
    }
    //查询平台所有信息
    selectPlatformInfo(id: any): Promise<any[]> {
        return this.getDB().select("platform", "id", id);
    }
    //通过平台列表选择平台
    selectPlatformByOr(platform: any, gameID: any, platformid: any): Promise<any[]> {
        var sql = "select gameID, platform from platform where (gameID='" + gameID + "' and platform='" + platform + "') and  id!=" + platformid;
        return this.getDB().selectBySql(sql);
    }
    //更新平台信息
    updatePlatformInfo(param: any): Promise<Array<any>> {
        return this.getDB().updateObject("platform", param, ["id"]);
    }
}
export =myProductEditSql;