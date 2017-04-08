"use strict";
const pm = require("../scripts/manager");
class MyappListsql {
    constructor() {
    }
    getDB() {
        return pm.handle().platform_info_db;
    }
    //统计游戏表的行数
    queryGameInfoNum(appName, userID) {
        var sql = "select count(*) as num from game where userID=" + userID;
        if (appName != "") {
            sql += " and ID = " + appName;
            ;
        }
        return this.getDB().selectBySql(sql);
    }
    //用于游戏的分页
    queryGameList(appName, userID, startPos, pageNum) {
        var sql = "select *from game where userID=" + userID;
        if (appName != "") {
            sql += " and ID = " + appName;
        }
        sql += " limit " + startPos + "," + pageNum;
        return this.getDB().selectBySql(sql);
    }
    //更新用户密码
    updateUserPassWord(newPassWord, accouontId) {
        return this.getDB().updateObject("account", { "password": newPassWord, "ID": accouontId }, ["ID"]);
    }
    //用于删除应用的信息
    deleteGameInfoById(game) {
        var sql = "delete from game where game.ID = " + game;
        return this.getDB().selectBySql(sql);
    }
}
module.exports = MyappListsql;
//# sourceMappingURL=myappListsql.js.map