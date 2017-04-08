"use strict";
const _ = require("underscore");
const pm = require("../scripts/manager");
var xlsx = require('node-xlsx');
require('datejs');
class PayGameInfo {
    constructor() { }
    payGameInfo(input, req, res) {
        let id = req.session["user"]["ID"];
        let game = input.game;
        let platform = input.platform;
        let time2 = input.time2 ? new Date(input.time2) : (new Date());
        let time1 = input.time1 ? new Date(input.time1) : (new Date()).addDays(-8);
        let db = pm.handle().platform_db;
        let db_info = pm.handle().platform_info_db;
        let query = [];
        query[0] = db.selectRange('pay_event', 'time', time1, time2);
        query[1] = db_info.select('game', 'userID', id);
        query[2] = db_info.selectAll('platform');
        Promise.all(query).then(arr => {
            let ps = arr[0];
            let games = arr[1].map(x => {
                let s = {};
                s.name = x.name;
                s.name2 = x.appName;
                s.id = x.ID;
                s.selected = (x.name == game);
                return s;
            });
            games = [{ name2: '全部' }, ...games];
            let platforms = _.chain(arr[2])
                .filter(x => games.find(y => y.id == x.gameID) != undefined)
                .map(x => x.platform)
                .uniq()
                .map(x => {
                let s = {};
                s.name = x;
                s.name2 = pm.handle().nameMap.get(x);
                s.selected = (x == platform);
                return s;
            }).value();
            platforms = [{ name2: '全部' }, ...platforms];
            let pf = (n) => {
                if (!platform)
                    return platforms.find(x => x.name == n) != undefined;
                if (n == platform)
                    return true;
            };
            let gf = (n) => {
                if (!game)
                    return games.find(x => x.name == n) != undefined;
                if (n == game)
                    return true;
            };
            let rps = _.chain(ps)
                .filter(x => pf(x.platform))
                .filter(x => gf(x.game));
            res.render('pay-admin/app/payGameInfo', { "session": req.session["user"], "games": games, "platforms": platforms, "list": rps.reverse(), "time1": time1.toString('yyyy-MM-dd'), "time2": time2.toString('yyyy-MM-dd') });
        });
        //创建PayObj对象
        // var PayObj = {};
        // PayObj["session"] = req.session["user"];
        // PayObj["PayObj"] = { "game": game, "platform": platform,"time":time };
        // PayObj["list"] = {};
        // var paygameInfoSql = new PayGameInfosql();
        // paygameInfoSql.queryPayGameInfoNum(game, platform,time).then(data1 => {
        //     var pager = <Pager>{};
        //     var pagecount = (parseInt(data1[0]["num"] / 20 + "") + (data1[0]["num"] %20 > 0 ? 1 : 0));
        //     pager.pageCount = pagecount;
        //     pager.pageCurrent = input.current ? input.current : 1;
        //     pager.maxNum = data1[0]["num"];
        //     pager.pagePath = "payGameInfo?";
        //     var obj = this;
        //     paygameInfoSql.queryPayGameList(game, platform, (pager.pageCurrent - 1) * 20, 20).then(data => {
        //         paygameInfoSql.disinctGame().then(data1 => {
        //             paygameInfoSql.distinctPlatform().then(data2 => {
        //                 data.forEach(per => {
        //                     per["time"] = obj.makeDate(per["time"]);
        //                 });
        //                 res.render('pay-admin/app/payGameInfo', { "session": req.session["user"], "pager": pager, "game": data1, "option": data2, "list": data }); 
        //             });
        //         });
        //     });
        // });
    }
}
module.exports = PayGameInfo;
//# sourceMappingURL=payGameInfo.js.map