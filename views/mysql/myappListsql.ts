﻿import util = require("../../scripts/util");
import _ = require('underscore');
import qs = require('qs');
import db = require('../../scripts/db');
import express = require('express');
import pm = require('../scripts/manager');

class MyappListsql {

    constructor() {

    }

    getDB(): db.Pool {
        return pm.handle().platform_info_db;
    }
    //统计游戏表的行数
    queryGameInfoNum(appName: string, userID: any): Promise<Array<any>> {
        var sql = "select count(*) as num from game where userID=" + userID;
        if (appName != "") {
            sql += " and ID = " + appName;;
        }
        return this.getDB().selectBySql(sql);
    }
    //用于游戏的分页
    queryGameList(appName: string, userID: any, startPos: any, pageNum: any): Promise<Array<any>> {
        var sql = "select *from game where userID=" + userID;
        if (appName != "") {
            sql += " and ID = " + appName;
        }
        sql += " limit " + startPos + "," + pageNum;
        return this.getDB().selectBySql(sql);
    }
    //更新用户密码
    updateUserPassWord(newPassWord: string, accouontId: any): Promise<Array<any>> {
        return this.getDB().updateObject("account", { "password": newPassWord, "ID": accouontId }, ["ID"]);
    }

    //用于删除应用的信息
    deleteGameInfoById(game:any): Promise<Array<any>> {
        var sql = "delete from game where game.ID = " + game;
        return this.getDB().selectBySql(sql);
    }
}

export = MyappListsql;