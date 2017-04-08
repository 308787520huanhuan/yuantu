"use strict";
const sql = require("mysql");
const _ = require("underscore");
require('datejs');
function valueConvert(val) {
    if (val == undefined || val == null)
        return null;
    if (typeof (val) == "string") {
        return "\"" + val + "\"";
    }
    if (val instanceof Date) {
        return "\"" + val.toString('yyyy-MM-dd HH:mm:ss') + "\"";
    }
    return val.toString();
}
function valueInit(val) {
    if (typeof (val) == "string") {
        return "";
    }
    else if (typeof (val) == "number") {
        return 0;
    }
    return undefined;
}
function trimEnd(str) {
    return str.substring(0, str.length - 1);
}
class Pool {
    constructor(config) {
        this.pool = sql.createPool(config);
        this.pool.getConnection((err, conn) => {
            if (err != null) {
                console.log(err.message);
            }
            else {
                console.log("db connected :" + conn.config.database);
            }
        });
    }
    query(cmd) {
        return new Promise((resolve, reject) => {
            this.pool.query(cmd, (err, value) => {
                if (err != null) {
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve(value);
                }
            });
        });
    }
    exist(table, key, value) {
        var cmd = "select 1 from " + table + " where " + key + " = " + valueConvert(value) + " limit 1 ";
        return this.query(cmd).then(x => x.length == 1);
    }
    existEq(table, eq) {
        var fst = true;
        var cmd = "select 1 from " + table + " where ";
        _.chain(eq).pairs()
            .filter(x => x[1] != null)
            .forEach(x => {
            if (fst)
                fst = false;
            else
                cmd += " and ";
            cmd += x[0] + " = " + valueConvert(x[1]);
        });
        cmd += " limit 1 ";
        return this.query(cmd).then(x => x.length == 1);
    }
    existLt(table, key, value, key2, lt) {
        var cmd = "select 1 from " + table + " where " + key + " = " + valueConvert(value)
            + " and " + key2 + " < " + valueConvert(lt) + " limit 1 ";
        return this.query(cmd).then(x => x.length == 1);
    }
    existGt(table, key, gt) {
        var cmd = "select 1 from " + table + " where " + key + " > " + valueConvert(gt) + " limit 1 ";
        return this.query(cmd).then(x => x.length == 1);
    }
    count(table, key, value) {
        var cmd = "select count(1) from " + table + " where " + key + " = " + valueConvert(value);
        return this.query(cmd);
    }
    select(table, key, value) {
        var cmd = "select * from " + table + " where " + key + " = " + valueConvert(value);
        return this.query(cmd);
    }
    selectAll(table) {
        var cmd = "select * from " + table;
        return this.query(cmd);
    }
    selectRange(table, key, min, max) {
        var cmd = "select * from " + table + " where " + key + " between " + valueConvert(min) + " and " + valueConvert(max);
        return this.query(cmd);
    }
    selectEq(table, eq) {
        var fst = true;
        var cmd = "select * from " + table + " where ";
        _.chain(eq).pairs()
            .filter(x => x[1] != null)
            .forEach(x => {
            if (fst)
                fst = false;
            else
                cmd += " and ";
            cmd += x[0] + " = " + valueConvert(x[1]);
        });
        return this.query(cmd);
    }
    selectBySql(sql) {
        return this.query(sql);
    }
    updateObject(table, obj, keys) {
        var cmd = "update " + table + " set ";
        var fst = true;
        _.chain(obj).pairs()
            .forEach(x => {
            cmd += x[0] + "=" + valueConvert(x[1]) + ",";
        });
        cmd = trimEnd(cmd);
        cmd += " where ";
        keys.forEach(key => {
            if (fst)
                fst = false;
            else
                cmd += " and ";
            cmd += key + " = " + valueConvert(obj[key]);
        });
        return this.query(cmd);
    }
    //type,table,name,id
    updateOneBySql(type, table, name, keys) {
        var cmd = "update " + table + " set ";
        if (type == "add") {
            cmd += name + " = " + name + " + 1";
        }
        else {
            cmd += name + " = " + name + " - 1";
        }
        cmd += " where ";
        for (var opt in keys) {
            cmd += opt + " = " + keys[opt];
        }
        return this.query(cmd);
    }
    insertObject(obj, table) {
        var cmd = "insert into " + table + " ";
        var keys = "(";
        var vals = "(";
        _.chain(obj)
            .pairs()
            .filter(x => x[1])
            .forEach(x => {
            keys += x[0] + ",";
            vals += valueConvert(x[1]) + ",";
        });
        keys = trimEnd(keys);
        vals = trimEnd(vals);
        keys += ")";
        vals += ")";
        cmd += keys + " values " + vals;
        return this.query(cmd);
    }
    insertArr(arr, table) {
        var cmd = "insert into " + table + " ";
        var keys = "(";
        var vals = "";
        _.chain(arr[0])
            .pairs()
            .filter(x => x[1])
            .forEach(x => {
            keys += x[0] + ",";
        });
        keys = trimEnd(keys);
        keys += ")";
        //构造value
        for (var i = 0; i < arr.length; i++) {
            var eachVal = "(";
            _.chain(arr[i])
                .pairs()
                .filter(x => x[1])
                .forEach(x => {
                eachVal += valueConvert(x[1]) + ",";
            });
            eachVal = trimEnd(eachVal);
            eachVal += ")";
            vals += eachVal + ",";
        }
        vals = trimEnd(vals);
        cmd += keys + " values " + vals;
        console.log("=========================================");
        console.log(cmd);
        return this.query(cmd);
    }
    updateArr(arr, table) {
        var cmd = "replace into " + table + " ";
        var keys = "(";
        var vals = "";
        _.chain(arr[0])
            .pairs()
            .filter(x => x[1])
            .forEach(x => {
            keys += x[0] + ",";
        });
        keys = trimEnd(keys);
        keys += ")";
        //构造value
        for (var i = 0; i < arr.length; i++) {
            var eachVal = "(";
            _.chain(arr[i])
                .pairs()
                .filter(x => x[1])
                .forEach(x => {
                eachVal += valueConvert(x[1]) + ",";
            });
            eachVal = trimEnd(eachVal);
            eachVal += ")";
            vals += eachVal + ",";
        }
        vals = trimEnd(vals);
        cmd += keys + " values " + vals;
        return this.query(cmd);
    }
}
exports.Pool = Pool;
//# sourceMappingURL=db.js.map