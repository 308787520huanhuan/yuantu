"use strict";
const pm = require("../scripts/manager");
class UserAuthsSql {
    constructor() {
    }
    getDB() {
        return pm.handle().yuantu_db;
    }
    insertData(user_auths) {
        return this.getDB().insertObject(user_auths, "user_third_authorization");
    }
    getUserAuthsBySourceAndOId(source, oid) {
        // return this.getDB().select('user_auths', 'identifier', identifier);
        var sql = "select * from user_third_authorization where (oid = '" + oid + "'  and source = '" + source + "')";
        return this.getDB().selectBySql(sql);
    }
}
module.exports = UserAuthsSql;
//# sourceMappingURL=userAuthsSql.js.map