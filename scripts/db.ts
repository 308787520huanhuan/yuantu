import sql = require('mysql');
import _ = require('underscore');
import util = require('./util');
require('datejs');
     
export interface Config {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    charset: string;
    connectionLimit: number;
}

export interface AnyResult {
    (result: any): void;
}

export interface ArrayResult {
    (result: Array<any>): void;
}

export interface ExistResult {
    (result: boolean): void;
}

export interface CountResult {
    (count: number): void;
}
   
function valueConvert(val: any): string {
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

function valueInit(val: any): any {
    if (typeof (val) == "string") {
        return "";
    } else if (typeof (val) == "number") {
        return 0;
    }
    return undefined;
}

function trimEnd(str: string): string {
    return str.substring(0, str.length - 1);
}

export class Pool {
    pool: sql.IPool;

    constructor(config: Config) {
        this.pool = sql.createPool(config);
        this.pool.getConnection((err, conn) => {
            if (err != null) {
                console.log(err.message);
            } else {
                console.log("db connected :" + conn.config.database);
            }
        });
    }

    query(cmd: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
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

    exist(table: string, key: string, value: any): Promise<boolean>{
        var cmd: string = "select 1 from " + table + " where " + key + " = " + valueConvert(value) + " limit 1 ";
        return this.query(cmd).then(x => x.length == 1);
    }


    existEq(table: string, eq: any): Promise<boolean> {
        var fst = true;
        var cmd: string = "select 1 from " + table + " where ";
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

    existLt(table: string, key: string, value: any, key2: string, lt: any ): Promise<boolean> {
        var cmd: string = "select 1 from " + table + " where " + key + " = " + valueConvert(value)
            + " and " + key2 + " < " + valueConvert(lt) + " limit 1 " ;
        return this.query(cmd).then(x => x.length == 1);
    }

    existGt(table: string, key: string, gt: any): Promise<boolean> {
        var cmd: string = "select 1 from " + table + " where " + key + " > " + valueConvert(gt) + " limit 1 ";
        return this.query(cmd).then(x => x.length == 1);
    }

    count(table: string, key: string, value: any): Promise<number>{
        var cmd: string = "select count(1) from " + table + " where " + key + " = " + valueConvert(value);
        return this.query(cmd);
    }

    select(table: string, key: string, value: any): Promise<Array<any>>{
        var cmd: string = "select * from " + table + " where " + key + " = " + valueConvert(value);
        return this.query(cmd);
    }
    
    selectAll(table: string): Promise<Array<any>>{
        var cmd: string = "select * from " + table;
        return this.query(cmd);
    }

    selectRange(table: string, key: string, min: any, max: any): Promise<Array<any>>{
        var cmd: string = "select * from " + table + " where " + key + " between " + valueConvert(min) + " and " + valueConvert(max);
        return this.query(cmd);
    }

    selectEq(table: string, eq: any): Promise<Array<any>>{
        var fst = true;
        var cmd: string = "select * from " + table + " where ";
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

    selectBySql(sql: string): Promise<Array<any>> {
        return this.query(sql);
    }

    updateObject(table: string, obj: any, keys: string[]): Promise<{}>{
        var cmd: string = "update " + table + " set ";
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
    updateOneBySql(type: string,table: string, name: string, keys: any): Promise<{}>{
        var cmd: string = "update " + table + " set ";
        if( type == "add")
        {
            cmd += name + " = " + name + " + 1";
        } 
        else
        {
            cmd += name + " = " + name + " - 1";
        }
        cmd += " where ";
        for( var opt in keys){
            cmd += opt + " = " + keys[opt];
        }
        return this.query(cmd);
    }

    insertObject(obj: any, table: string): Promise<{}> {
        var cmd: string = "insert into " + table + " ";
        var keys: string = "(";
        var vals: string = "(";
        _.chain(obj)
            .pairs()
            .filter( x => x[1])
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

    insertArr(arr: any, table: string): Promise<{}> {
        var cmd: string = "insert into " + table + " ";
        var keys: string = "(";
        var vals: string = "";
        _.chain(arr[0])
            .pairs()
            .filter( x => x[1])
            .forEach(x => {
                keys += x[0] + ",";
            });
        keys = trimEnd(keys);
        keys += ")";
        //构造value
        for(var i = 0; i < arr.length; i++){
            var eachVal: string = "(";
            _.chain(arr[i])
                .pairs()
                .filter( x => x[1])
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

    updateArr(arr: any, table: string): Promise<{}> {
        var cmd: string = "replace into " + table + " ";
        var keys: string = "(";
        var vals: string = "";
        _.chain(arr[0])
            .pairs()
            .filter( x => x[1])
            .forEach(x => {
                keys += x[0] + ",";
            });
        keys = trimEnd(keys);
        keys += ")";
        //构造value
        for(var i = 0; i < arr.length; i++){
            var eachVal: string = "(";
            _.chain(arr[i])
                .pairs()
                .filter( x => x[1])
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