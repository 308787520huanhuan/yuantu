"use strict";
const pm = require("../scripts/manager");
class PayGameInfo {
    constructor() { }
    getDB() {
        return pm.handle().platform_db;
    }
    //统计支付信息表的行数
    queryPayGameInfoNum(game, platform, time) {
        var sql = "select count(*) as num from pay_event where game like '%" + game + "%' and platform like '%" + platform + "%' and time like '%" + time + "%'";
        return this.getDB().selectBySql(sql);
    }
    //用于支付信息的分页
    queryPayGameList(game, platform, startPos, pageNum) {
        var sql = "select *from pay_event where game like '%" + game + "%' and platform like '%" + platform + "%' limit " + startPos + "," + pageNum;
        return this.getDB().selectBySql(sql);
    }
    //用于平台去重
    distinctPlatform() {
        var sql = "select distinct platform from pay_event";
        return this.getDB().selectBySql(sql);
    }
    //用于游戏去重
    disinctGame() {
        var sql = "select distinct game from pay_event";
        return this.getDB().selectBySql(sql);
    }
}
module.exports = PayGameInfo;
//# sourceMappingURL=payGameInfosql.js.map