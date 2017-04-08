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

interface IRetain {
    time: Date;
    platform: string;  //平台名称
    game: string; //游戏名称
    active: number;
    born: number;
    awk1: number;
    awk3: number;
    awk7: number;
    awk15: number;
    awk30: number;
}

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

interface IPay {
    time: Date;
    pay_money: number;
    pay_count: number;
    pay_people: number;
}

interface ITotal {
    time: Date;
    platform: string;  //平台名称
    game: string; //游戏名称
    active: number;
    born: number;
    awk1: number;
    awk7: number;
    awk30: number;
    pay_money: number;
    pay_count: number;
    pay_people: number;
    born_arpu: number;
    active_arpu: number;
    pay_arpu: number;
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

interface IBorn {
    time: Date;
    born: number;
}

function getDay(time: Date, day: number): number {
    let date = new Date(time.getTime());
    date.setHours(0,0,0,0);
    date.addDays(day);
    return date.getTime();
}

class alllist {
    constructor() { }

    mergePay(gs: any, time: Date): IPay{
        let pay = <IPay>{};
        let set = new Set<string>();
        pay.time = time;
        pay.pay_count = 0;
        pay.pay_people = 0;
        pay.pay_money = 0;
        for(let k in gs) {
            let v = gs[k];
            if( k == time.toString() ) {
                for(let t of v) {
                    let e = <IPayEvent>t;
                    pay.pay_count++;
                    pay.pay_money += e.price;
                    set.add(e.uid);
                }
                pay.pay_people = set.size;
                return pay;
            }
        }
        return pay;
    }
    
    mergeRetain(gs: any): IRetain[] {
        let rm = new Map<string, IRetain>();
        for(let k in gs) {
            let vs = <IRetain[]>gs[k];
            let m = rm.get(k);
            if(!m) {
                m = <IRetain>{};
                m.active = 0;
                m.born = 0;
                m.awk1 = 0;
                m.awk7 = 0;
                m.awk30 = 0;
                rm.set(k, m);
            }
            for(let v of vs) {
                m.active += v.active;
                m.born += v.born;
                m.awk1 += v.awk1;
                m.awk7 += v.awk7;
                m.awk30 += v.awk30;
                m.time = v.time;
            }
        }
        return [...rm.values()];
    }


    calcRetain(gs: IRetain[]) {
        let m = new Map<number , IRetain>();
        for(let g of gs) {
            m.set(g.time.getTime(), g);
        }
        for(let g of gs) {
            let d1 = m.get(getDay(g.time, -1));
            let d7 = m.get(getDay(g.time, -7));
            let d30 = m.get(getDay(g.time, -30));
            if(d1)
                g.awk1 = d1.born ? (g.awk1/d1.born) : 0;
            if(d7)
                g.awk7 = d7.born ? (g.awk7/d7.born) : 0;
            if(d30)
                g.awk30 = d30.born ? (g.awk30/d30.born) : 0;
        }
    }

    alllist(input: any, req: express.Request, res: express.Response): void {
        let id = req.session["user"]["ID"];
        let game = input.game;
        let platform = input.platform;
        let time2 = input.time2 ? new Date(input.time2) : (new Date());
        let time1 = input.time1 ? new Date(input.time1) : (new Date()).addDays(-8);
        let db = pm.handle().platform_db;
        let db_info = pm.handle().platform_info_db;
        let query = [];
        query[0] = db.selectRange('retain', 'time', (new Date(time1.getTime())).addDays(-31), time2);
        query[1] = db.selectRange('pay_event', 'time', time1, time2);
        query[2] = db_info.select('game', 'userID', id);
        query[3] = db_info.selectAll('platform');
        Promise.all(query).then(arr => {
            let rs: IRetain[] = arr[0];
            let ps: IPayEvent[] = arr[1];

            let ts = <ITotal[]>[];
            let games = (<IGame[]>arr[2]).map(x => {
                let s = <ISelect>{};
                s.name = x.name;
                s.name2 = x.appName;
                s.id = x.ID;
                s.selected = (x.name == game);
                return s;
            });

            games = [<ISelect>{name2: '全部'}, ...games];

            let platforms = _.chain(<IPlatform[]>arr[3])
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

            let rgs = _.chain(rs)
                .filter(x => pf(x.platform))
                .filter(x => gf(x.game) )
                .groupBy(x => x.time.toString()).value();
            rs = this.mergeRetain(rgs);
            this.calcRetain(rs);
            rs = rs.filter(x => x.time.getTime() > time1.getTime());
            let gs = _.chain(ps)
                .filter(x => pf(x.platform))
                .filter(x => gf(x.game) )
                .forEach(x => x.time.setHours(0, 0, 0, 0))
                .groupBy(x => x.time.toString()).value();
            for(let r of rs) {
                let t = <ITotal>{};
                Object.assign(t, r);
                Object.assign(t, this.mergePay(gs, r.time));
                t.born_arpu = t.born ? (t.pay_money / t.born) : 0;
                t.active_arpu = t.active  ? (t.pay_money / t.active) : 0;
                t.pay_arpu = t.pay_people ? (t.pay_money / t.pay_people) : 0;
                ts.push(t);
            }
            let dds = ts.map(x => {
                return {
                    "日期": x.time.toString('yyyy-MM-dd'),
                    "活跃人数": x.active,
                    "新增人数": x.born,
                    "次日留存": x.awk1.toFixed(2),
                    "7日留存": x.awk7.toFixed(2),
                    "30日留存": x.awk30.toFixed(2),
                    "付费人数": x.pay_people,
                    "付费次数": x.pay_count,
                    "总付费": x.pay_money,
                    "新增ARPU": x.born_arpu.toFixed(2),
                    "活跃ARPU": x.active_arpu.toFixed(2),
                    "付费ARPU": x.pay_arpu.toFixed(2),
                }
            })
            let ds = [_.keys(dds[0]), ...dds.map(x => _.values(x))];
            let file = xlsx.build([{name: "sheet", data:ds}]);
            let name = util.shortMD5(id.toString()) + '.xlsx';
            fs.writeFileSync('./public/' + name, file, 'binary');
            res.render("pay-admin/home/alllist", { "session": req.session["user"] , "games": games, "platforms":platforms, "list":ts.reverse(),"time1":time1.toString('yyyy-MM-dd'),"time2":time2.toString('yyyy-MM-dd'),"game":game,"paltform":platform, "xlsx": name});
        });
    }
}

export = alllist;