/// <reference path="node-uuid-global.d.ts" />
var uid1 = uuid.v1();
var uid4 = uuid.v4();
var options = {
    node: [],
    clockseq: 2,
    nsecs: 3,
    msecs: new Date()
};
var padding = [0, 1, 2];
var offset = 15;
var buf = [];
uuid.parse(uid4, buf, offset);
uuid.unparse(buf, offset);
var uid21 = uuid.v1(options, padding, offset);
var uid24 = uuid.v4(options, padding, offset);
//# sourceMappingURL=node-uuid-global-tests.js.map