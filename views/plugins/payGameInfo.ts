import util = require("../../scripts/util");
import _ = require('underscore');
import qs = require('qs');
import express = require('express');
import man = require('../scripts/manager');
import Alllistsql = require('../mysql/alllistsql');
import db = require('../../scripts/db');
import pm = require('../scripts/manager');
import fs = require('fs');
var xlsx = require('node-xlsx'); 
require('datejs');

interface IPayEvent {
    time: Date;
    platform: string;  //平台名称
    game: string; //游戏名称
    pid: string; //平台id
    uid: string;  //内部唯一标识
    order_id: string; //昵称
    price: number;
    ext: string;
}

interface IGame {
    ID: number;
    userID: number;
    name: string;
    appName: string;
}

interface IPlatform {
    id: number;
    gameID: number;
    platform: string;
}

interface ISelect {
    name: string;
    name2: string; // 中文名字
    id: number;
    selected: boolean
}


class PayGameInfo {

    constructor() { }

    payGameInfo(input: any, req: express.Request, res: express.Response): void {
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
            let ps: IPayEvent[] = arr[0];
            let games = (<IGame[]>arr[1]).map(x => {
                let s = <ISelect>{};
                s.name = x.name;
                s.name2 = x.appName;
                s.id = x.ID;
                s.selected = (x.name == game);
                return s;
            });

            games = [<ISelect>{name2: '全部'}, ...games];

            let platforms = _.chain(<IPlatform[]>arr[2])
                .filter(x => games.find(y => y.id == x.gameID) != undefined)
                .map(x => x.platform)
                .uniq()
                .map(x => {
                    let s = <ISelect>{};
                    s.name = x;
                    s.name2 = pm.handle().nameMap.get(x);
                    s.selected = (x == platform);
                    return s;
                }).value();
            
            platforms = [<ISelect>{name2: '全部'}, ...platforms];

            let pf = (n: string): boolean => {
                if( !platform )
                    return platforms.find(x => x.name == n) != undefined;
                if(n == platform)
                    return true;
            }

            let gf = (n: string): boolean => {
                if( !game )
                    return games.find(x => x.name == n) != undefined;
                if(n == game)
                    return true;
            }
            let rps = _.chain(ps)
                .filter(x => pf(x.platform))
                .filter(x => gf(x.game) )

            res.render('pay-admin/app/payGameInfo', { "session": req.session["user"],  "games": games, "platforms":platforms, "list": rps.reverse(), "time1":time1.toString('yyyy-MM-dd'),"time2":time2.toString('yyyy-MM-dd') });
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

  export = PayGameInfo;