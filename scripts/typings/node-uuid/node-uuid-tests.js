/// <reference path="node-uuid.d.ts" />
"use strict";
const nodeUuid = require("node-uuid");
var uid1 = nodeUuid.v1();
var uid4 = nodeUuid.v4();
var options = {
    node: [],
    clockseq: 2,
    nsecs: 3,
    msecs: new Date()
};
var padding = [0, 1, 2];
var offset = 15;
var buf = [];
nodeUuid.parse(uid4, buf, offset);
nodeUuid.unparse(buf, offset);
var uid21 = nodeUuid.v1(options, padding, offset);
var uid24 = nodeUuid.v4(options, padding, offset);
var buffer;
var uid31 = nodeUuid.v1(options, buffer, offset);
var uid34 = nodeUuid.v4(options, buffer, offset);
//# sourceMappingURL=node-uuid-tests.js.map