import util = require("../../scripts/util");
import _ = require('underscore');
import qs = require('qs');
import db = require('../../scripts/db');
import express = require('express');
import pm = require('../scripts/manager');

class Loginsql {

    constructor() {

    }

    getDB(): db.Pool {
        return pm.handle().platform_info_db;
    }

    checkLoginAccount(userName: string): Promise<any[]> {
        return this.getDB().select('account', 'username', userName);
    }

}

export = Loginsql;