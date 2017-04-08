"use strict";
const man = require("../scripts/manager");
const MyProductPagingsql = require("../mysql/myProductPagingsql");
class myProduct {
    constructor() { }
    myProductPaging(input, req, res) {
        var platform = input.platform ? input.platform : "";
        var myProductPagingsql = new MyProductPagingsql();
        myProductPagingsql.queryPlatformInfoNum(platform, req.session["user"]["ID"]).then(data1 => {
            var pager = {};
            var pagecount = (parseInt(data1[0]["num"] / 10 + "") + (data1[0]["num"] % 10 > 0 ? 1 : 0));
            pager.pageCount = pagecount;
            pager.pageCurrent = input.current ? input.current : 1;
            pager.maxNum = data1[0]["num"];
            pager.pagePath = "myProductPaging?";
            myProductPagingsql.queryPlatformList(platform, req.session["user"]["ID"], (pager.pageCurrent - 1) * 10, 10).then(data => {
                myProductPagingsql.DistinctGame(req.session["user"]["ID"]).then(data1 => {
                    for (var i = 0; i < data.length; i++) {
                        data[i]["platform1"] = man.handle().convertToFullname(data[i]["platform"]);
                    }
                    res.render('pay-admin/product/myProductPaging', { "session": req.session["user"], "list": data, "option": data, "pager": pager, "platform": platform, "game": data1 });
                });
            });
        });
    }
}
module.exports = myProduct;
//# sourceMappingURL=myProductPaging.js.map