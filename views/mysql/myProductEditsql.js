"use strict";
const pm = require("../scripts/manager");
class myProductEditSql {
    constructor() { }
    getDB() {
        return pm.handle().platform_info_db;
    }
    //插入数据
    insertData(param) {
        return this.getDB().insertObject(param, "platform");
    }
    //通过用户选择游戏
    selectGameByUserID(id) {
        return this.getDB().select("game", "userID", id);
    }
    //查询平台所有信息
    selectPlatformInfo(id) {
        return this.getDB().select("platform", "id", id);
    }
    //通过平台列表选择平台
    selectPlatformByOr(platform, gameID, platformid) {
        var sql = "select gameID, platform from platform where (gameID='" + gameID + "' and platform='" + platform + "') and  id!=" + platformid;
        return this.getDB().selectBySql(sql);
    }
    //更新平台信息
    updatePlatformInfo(param) {
        return this.getDB().updateObject("platform", param, ["id"]);
    }
}
module.exports = myProductEditSql;
//# sourceMappingURL=myProductEditsql.js.map