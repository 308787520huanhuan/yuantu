"use strict";
const pm = require("../scripts/manager");
class Alllistsql {
    constructor() { }
    getDB() {
        return pm.handle().platform_db;
    }
    //统计总览近10天的行数
    queryAlllistNum(platform, game, time1, time2) {
        var sql = "select * from (select a.time,platform,game,born,active,awk1,awk7,awk30,num,account,price from (select time,platform,game,born,active,awk1,awk7,awk30 from retain) a left join (select d.time,d.num,e.account,e.price from(select time,count(uid) as num from (select uid, date_format(min(time),'%Y-%m-%d') as time from pay_event group by uid) e where time  <= date(time) group by time) d left join (select date_format(time,'%Y-%m-%d') as time,count(uid) as account,price from pay_event group by time) e on d.time=e.time) c on a.time=c.time) a where platform like '%" + platform + "%' and game like '%" + game + "%' and time >= '" + time1 + "' and time <= '" + time2 + "' order by  time desc";
        return this.getDB().selectBySql(sql);
    }
    //用于平台去重
    distinctPlatform() {
        var sql = "select distinct platform from retain";
        return this.getDB().selectBySql(sql);
    }
    //用于游戏的去重
    disinctGame() {
        var sql = "select distinct game from retain";
        return this.getDB().selectBySql(sql);
    }
}
module.exports = Alllistsql;
//# sourceMappingURL=alllistsql.js.map