"use strict";
const pm = require("../scripts/manager");
class OrderListensql {
    constructor() {
    }
    getDB() {
        return pm.handle().platform_info_db;
    }
    getOrderList(status) {
        var sql = "select * from activity,orders where orders.status =" + status + " and activity.id = orders.activity_id";
        return this.getDB().selectBySql(sql);
    }
    getOrderInfo(id) {
        return this.getDB().select('orders', 'id', id);
    }
}
module.exports = OrderListensql;
//# sourceMappingURL=orderListhensql.js.map