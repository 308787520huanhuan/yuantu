import util = require("../../scripts/util");
import _ = require('underscore');
import qs = require('qs');
import db = require('../../scripts/db');
import express = require('express');
import pm = require('../scripts/manager');

class OrderListensql {

    constructor() {

    }

    getDB(): db.Pool {
        return pm.handle().platform_info_db;
    }

    getOrderList(status): Promise<any[]> 
    {
        var sql = "select * from activity,orders where orders.status =" + status + " and activity.id = orders.activity_id";
        return this.getDB().selectBySql(sql);
    }
    getOrderInfo(id): Promise<any[]> {
        return this.getDB().select('orders', 'id', id);
    }

}

export = OrderListensql;