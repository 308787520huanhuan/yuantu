import util = require("../../scripts/util");
import _ = require('underscore');
import qs = require('qs');
import db = require('../../scripts/db');
import express = require('express');
import pm = require('../scripts/manager');

class myAppEditSql {

    constructor() { }

    getDB(): db.Pool {
        return pm.handle().platform_info_db;
    }

    insertData(param: any): Promise<any[]> {
        return this.getDB().insertObject(param, "game");
    }

    selectGameInfo(id: any): Promise<any[]> {
        return this.getDB().select("game", "ID", id);
    }

    selectGameByOr(name: any, appName: any, gameid: any): Promise<any[]> {
        var sql = "select name, appName from game where (name='" + name + "' or appName='" + appName + "') and ID !=" + gameid;
        return this.getDB().selectBySql(sql);
    }

    updateGameInfo(param: any): Promise<Array<any>> {
        return this.getDB().updateObject("game", param, ["ID"]);
    }
}
export =myAppEditSql;