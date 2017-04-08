"use strict";
const pm = require("../scripts/manager");
class loginRetain {
    constructor() { }
    getDB() {
        return pm.handle().platform_db;
    }
    //用于统计活跃的总人数
    getActivepeople() {
        var sql = "select DATE_FORMAT(time,'%Y-%m') as month,sum(active) as active from retain  where DATE_FORMAT(time,'%Y')=2016 group by month order by month";
        return this.getDB().selectBySql(sql);
    }
    //用于统计新增的人数
    getBornpople() {
        var sql = "select DATE_FORMAT(time,'%Y-%m') as month,sum(born) as born from retain  where DATE_FORMAT(time,'%Y')=2016 group by month order by month";
        return this.getDB().selectBySql(sql);
    }
}
module.exports = loginRetain;
//# sourceMappingURL=loginRetainsql.js.map