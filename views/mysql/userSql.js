"use strict";
const pm = require("../scripts/manager");
class UserSql {
    constructor() {
    }
    getDB() {
        return pm.handle().yuantu_db;
    }
    insertData(user) {
        user.created_time = new Date();
        user.modified_time = user.created_time;
        user.status = 1;
        return this.getDB().insertObject(user, "user");
    }
    getUsers(user_id) {
        // return this.getDB().select('user_auths', 'identifier', identifier);
        return this.getDB().select('user', 'id', user_id);
    }
    getUser(id) {
        var sql = "select * from user where id = " + id;
        return this.getDB().query(sql);
    }
}
module.exports = UserSql;
//# sourceMappingURL=userSql.js.map