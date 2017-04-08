"use strict";
const pm = require("../scripts/manager");
class Loginsql {
    constructor() {
    }
    getDB() {
        return pm.handle().platform_info_db;
    }
    checkLoginAccount(userName) {
        return this.getDB().select('account', 'username', userName);
    }
}
module.exports = Loginsql;
//# sourceMappingURL=loginsql.js.map