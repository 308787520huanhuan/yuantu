"use strict";
const pm = require("../scripts/manager");
class myAppEditSql {
    constructor() { }
    getDB() {
        return pm.handle().platform_info_db;
    }
    insertData(param) {
        return this.getDB().insertObject(param, "game");
    }
    selectGameInfo(id) {
        return this.getDB().select("game", "ID", id);
    }
    selectGameByOr(name, appName, gameid) {
        var sql = "select name, appName from game where (name='" + name + "' or appName='" + appName + "') and ID !=" + gameid;
        return this.getDB().selectBySql(sql);
    }
    updateGameInfo(param) {
        return this.getDB().updateObject("game", param, ["ID"]);
    }
}
module.exports = myAppEditSql;
//# sourceMappingURL=myAppEditsql.js.map