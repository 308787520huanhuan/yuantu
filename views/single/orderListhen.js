"use strict";
const OrderListensql = require("../mysql/orderListhensql");
const ytRaidersSql = require("../mysql/ytRaidersSql");
class OrderListen {
    constructor() {
    }
    start() {
        console.log("============================start================================");
        var recommendList = new OrderListensql();
        //待支付订单超过一个小时 自动取消订单
        recommendList.getOrderList(1).then(data => {
            var len = data.length;
            for (var i = 0; i < len; i++) {
                var value = data[i];
                var add_time = new Date(value.add_time);
                // add_time.setDate(add_time.getDate() + 1);  
                //一个小时以后取消订单
                add_time.setHours(add_time.getHours() + 1);
                var current = new Date(new Date().toLocaleString()).getTime();
                console.log("start->current: " + current);
                console.log("start->add_time: " + add_time.getTime());
                var length = add_time.getTime() - current;
                var raidersList = new ytRaidersSql();
                console.log("start->length: " + length);
                if (length < 0) {
                    //已经过期 取消订单
                    raidersList.cancelOrder(value.id).then(data => {
                        raidersList.addOrminus("minus", "activity", "solded", { "id": value.activity_id }).then(data => {
                            console.log("start->取消订单成功");
                            return;
                        });
                    });
                }
                else {
                    //this.listen(value.id,value.add_time);
                    this.listen(value.id, length);
                }
            }
        });
    }
    listen(id, len) {
        var recommendList = new OrderListensql();
        var raidersList = new ytRaidersSql();
        setTimeout(function () {
            //先获得列表
            recommendList.getOrderInfo(id).then(data => {
                //如果是待支付订单 则过期取消
                if (data[0]['status'] == 1) {
                    raidersList.cancelOrder(id).then(data => {
                        raidersList.addOrminus("minus", "activity", "solded", { "id": id }).then(data => {
                            console.log("取消订单成功");
                            return;
                        });
                    });
                }
            });
        }, len);
    }
}
module.exports = OrderListen;
//# sourceMappingURL=orderListhen.js.map