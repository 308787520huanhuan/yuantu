import util = require("../../scripts/util");
import _ = require('underscore');
import qs = require('qs');
import db = require('../../scripts/db');
import express = require('express');
import pm = require('../scripts/manager');

class UserAuthsSql {

    constructor() {

    }

    getDB(): db.Pool {
        return pm.handle().yuantu_db;
    }

    insertData(user_auths:any): Promise<{}> {
        return this.getDB().insertObject(user_auths,"user_third_authorization");
    }

    getUserAuthsBySourceAndOId(source: any, oid: string): Promise<any[]> {
        // return this.getDB().select('user_auths', 'identifier', identifier);
        var sql = "select * from user_third_authorization where (oid = '"+oid+"'  and source = '"+source+"')";
        return this.getDB().selectBySql(sql);
    }

    // getUserAuthsBySourceAndUId(source: any, uid: string): Promise<any[]> {
    //     var sql = "select * from user_third_authorization where (uid = '"+uid+"'  and source = '"+source+"')";
    //     return this.getDB().selectBySql(sql);
    // }
}

export = UserAuthsSql;