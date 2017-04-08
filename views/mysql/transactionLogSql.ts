import util = require("../../scripts/util");
import _ = require('underscore');
import qs = require('qs');
import db = require('../../scripts/db');
import express = require('express');
import pm = require('../scripts/manager');

class TransactionLogSql {

    constructor() {

    }

    getDB(): db.Pool {
        return pm.handle().yuantu_db;
    }

    insertData(transaction:any): Promise<{}> {
        transaction.add_time = new Date();
        return this.getDB().insertObject(transaction,"transaction_log");
    }

    updateData(params:any): Promise<Array<any>> {
        return this.getDB().updateObject("transaction_log", params, ["oid"]);
    }

    getTransactions(chargeId:any): Promise<any[]> {
        // return this.getDB().select('user_auths', 'identifier', identifier);
        return this.getDB().select('transaction_log','oid',chargeId);
    }
}

export = TransactionLogSql;