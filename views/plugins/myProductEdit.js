"use strict";
const man = require("../scripts/manager");
const MyProductEditSql = require("../mysql/myProductEditsql");
const MyProductPagingsql = require("../mysql/myProductPagingsql");
class MyProductEdit {
    constructor() { }
    myProductEdit(input, req, res) {
        var platform = input.platform;
        var appID = input.appID;
        var appKey = input.appKey;
        var gameId = input.gameID;
        var payKey = input.payKey;
        var paybackKey = input.paybackKey;
        var testUrl = input.testUrl;
        //创建platformData对象
        var platformData = {
            "platform": platform, "appID": appID, "appKey": appKey, "payKey": payKey,
            "paybackKey": paybackKey, "testUrl": testUrl, "gameID": gameId
        };
        //判断这些参数是否正确
        if (!platform || !appID || !payKey || !paybackKey || !appKey || !testUrl || platform.length == 0
            || appID.length == 0 || payKey.length == 0 || paybackKey.length == 0 || testUrl.length == 0 || appKey.length == 0) {
            var resultData = {};
            resultData["err"] = "参数不正确";
            resultData["session"] = req.session["user"];
            resultData["platformData"] = platformData;
            var myProductEdit = new MyProductEditSql();
            myProductEdit.selectGameByUserID(req.session["user"]["ID"]).then(data => {
                platformData["option"] = data;
                res.render("pay-admin/product/myProductEdit", platformData);
            });
            // res.render("pay-admin/product/myProductEdit", platformData);
            return;
        }
        var myProductEdit = new MyProductEditSql();
        var platformid = input.platformid;
        if (!platformid) {
            platformid = 0;
        }
        //验证参数的存在
        myProductEdit.selectPlatformByOr(platform, gameId, platformid).then(data2 => {
            if (data2.length > 0) {
                var resultData = {};
                resultData["err"] = "该条信息已经存在";
                resultData["session"] = req.session["user"];
                resultData["platformData"] = platformData;
                resultData["platformData"]["id"] = platformid;
                res.render("pay-admin/product/myProductEdit", resultData);
                return;
            }
            //插入数据到数据库
            if (platformid == 0) {
                myProductEdit.insertData(platformData).then(data => {
                    res.redirect("views/myProductPaging/myProductPaging");
                });
            }
            else {
                platformData["id"] = platformid;
                myProductEdit.updatePlatformInfo(platformData).then(data => {
                    if (data["affectedRows"] > 0) {
                        res.redirect("views/myProductPaging/myProductPaging");
                    }
                });
            }
        });
    }
    //查看选择平台信息
    myPlatInfoById(input, req, res) {
        var id = input.id;
        var myProductEditsql = new MyProductEditSql();
        myProductEditsql.selectPlatformInfo(id).then(data => {
            data.forEach(per => {
                myProductEditsql.selectGameByUserID(req.session["user"]["ID"]).then(data1 => {
                    var str = man.handle().getPlatformFullnameList().toString().split(",");
                    var platformName = [];
                    for (var i = 0; i < str.length; i++) {
                        platformName[i] = str[i];
                    }
                    res.render("pay-admin/product/myProductEdit", { "platformName": platformName, "platformData": per, "err": "", "session": req.session["user"], "option": data1 });
                });
                return;
            });
        });
    }
    //新增平台
    gotoAddMyPlatform(input, req, res) {
        var myProductEditsql = new MyProductEditSql();
        myProductEditsql.selectGameByUserID(req.session["user"]["ID"]).then(data => {
            var str = man.handle().getPlatformFullnameList().toString().split(",");
            var platformName = [];
            for (var i = 0; i < str.length; i++) {
                platformName[i] = str[i];
            }
            res.render("pay-admin/product/myProductEdit", { "platformName": platformName, "err": "", "session": req.session["user"], "platformData": {}, "option": data });
        });
    }
    //删除平台信息
    deleteMyPlatform(input, req, res) {
        var id = input.id;
        var myProductPagingSql = new MyProductPagingsql();
        myProductPagingSql.deletePlatformInfoById(id).then(data => {
            res.redirect("views/myProductPaging/myProductPaging");
        });
    }
}
module.exports = MyProductEdit;
//# sourceMappingURL=myProductEdit.js.map