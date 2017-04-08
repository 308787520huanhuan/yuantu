"use strict";
const pm = require("../scripts/manager");
class MyProductPagingsql {
    constructor() { }
    getDB() {
        return pm.handle().platform_info_db;
    }
    //通过用户选择游戏
    selectGameByUserID(id) {
        return this.getDB().select("game", "userID", id);
    }
    //统计平台表的行数
    queryPlatformInfoNum(platform, gameID) {
        var sql = "select  count(*) as num from game,platform where game.userID=1 and game.ID = platform.gameID and platform like '%" + platform + "%' and game.name like '%" + gameID + "%' ";
        return this.getDB().selectBySql(sql);
    }
    //用于平台分页
    queryPlatformList(platform, gameID, startPos, pageNum) {
        var sql = "select *from game,platform where game.userID=1 and game.ID = platform.gameID and platform like '%" + platform + "%' limit " + startPos + ", " + pageNum;
        return this.getDB().selectBySql(sql);
    }
    //更新用户密码
    updateUserPassWord(newPassWord, accouontId) {
        return this.getDB().updateObject("account", { "password": newPassWord, "ID": accouontId }, ["ID"]);
    }
    //用于删除平台的数据
    deletePlatformInfoById(platform) {
        var sql = "delete from platform where platform.ID = " + platform;
        return this.getDB().selectBySql(sql);
    }
    //用于条件查询的游戏名称去重
    DistinctGame(gameID) {
        var sql = "select distinct gameID,appName from platform,game where game.userID=1 and game.ID=platform.gameID";
        return this.getDB().selectBySql(sql);
    }
}
module.exports = MyProductPagingsql;
//# sourceMappingURL=myProductPagingsql.js.map