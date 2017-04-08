import util = require("../../scripts/util");
import _ = require('underscore');
import qs = require('qs');
import db = require('../../scripts/db');
import express = require('express');
import pm = require('../scripts/manager');


class UserSql {

    constructor() {

    }

    getDB(): db.Pool {
        return pm.handle().yuantu_db;
    }

    insertData(user:any): Promise<{}> {
        user.created_time = new Date();
        user.modified_time = user.created_time;
        user.status = 1;
        return this.getDB().insertObject(user,"user");
    }

    getUsers(user_id: any): Promise<any[]> {
        // return this.getDB().select('user_auths', 'identifier', identifier);
        return this.getDB().select('user','id',user_id);
    }

    getUser(id: any):Promise<{}> {
        var sql = "select * from user where id = "+id;
        return this.getDB().query(sql);
    }
}

export = UserSql;