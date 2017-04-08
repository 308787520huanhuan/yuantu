"use strict";
const pm = require("../scripts/manager");
class PayGameInfoDetailsql {
    constructor() { }
    getDB() {
        return pm.handle().platform_db;
    }
    //用于统计支付的总价格数
    getSumPrice() {
        var sql = "select DATE_FORMAT(time,'%Y-%m') as month,sum(price) as price from pay_event  where DATE_FORMAT(time,'%Y')=2016 group by month order by month";
        return this.getDB().selectBySql(sql);
    }
    //用于统计总人数
    getSumPeople() {
        var sql = "select DATE_FORMAT(time,'%Y-%m') as month, count(distinct(uid)) as uid  from pay_event  where DATE_FORMAT(time,'%Y')=2016 group by month order by month";
        return this.getDB().selectBySql(sql);
    }
}
module.exports = PayGameInfoDetailsql;
//# sourceMappingURL=payGameInfoDetailsql.js.map