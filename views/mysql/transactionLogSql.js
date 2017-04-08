"use strict";
const pm = require("../scripts/manager");
class TransactionLogSql {
    constructor() {
    }
    getDB() {
        return pm.handle().yuantu_db;
    }
    insertData(transaction) {
        transaction.add_time = new Date();
        return this.getDB().insertObject(transaction, "transaction_log");
    }
    updateData(params) {
        return this.getDB().updateObject("transaction_log", params, ["oid"]);
    }
    getTransactions(chargeId) {
        // return this.getDB().select('user_auths', 'identifier', identifier);
        return this.getDB().select('transaction_log', 'oid', chargeId);
    }
}
module.exports = TransactionLogSql;
//# sourceMappingURL=transactionLogSql.js.map