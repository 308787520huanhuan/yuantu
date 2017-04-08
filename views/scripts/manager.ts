import util = require("../../scripts/util");
import db = require('../../scripts/db');
import fs = require('fs');
import qs = require('qs');
import _ = require('underscore');
import path = require('path');


interface IConfig {
    db: db.Config;
    debug_db: db.Config;
    platform_info: db.Config;
    yuantu_db: db.Config;
}

class ViewManager {
    platforms: util.IMap<{}>;
    yuantu_db: db.Pool;
    platform_db: db.Pool;
    platform_info_db: db.Pool;
    config: IConfig;
    nameMap: Map<string, string>;
    private static _handle: ViewManager = null;
    constructor() {
        this.platforms = {};
        var data: string = fs.readFileSync("config.json", 'utf-8');
        this.config = JSON.parse(data);
        this.yuantu_db = new db.Pool(this.config.yuantu_db);
        this.platform_db = this.yuantu_db;
        this.platform_info_db = this.yuantu_db;
        this.nameMap = new Map<string, string>();
    }    

    static handle(): ViewManager {
        if (ViewManager._handle == null) {
            ViewManager._handle = new ViewManager();
        }
        return ViewManager._handle;
    }

    loadPlugin(filename: string): boolean {
        var name = filename.substring(0, filename.length - 3);
        var mdname = '../plugins/' + filename.substring(0, filename.length - 3);
        if (!this.platforms.hasOwnProperty(name)) {
            var fm = require(mdname);
            this.platforms[name] = new fm();
            return true;
        }
        return false;
    }

    reloadAllPlugins(): string {
        var log: string = "";
        var files: Array<string> = fs.readdirSync('./views/plugins/');
        files.forEach(name => {
            if (path.extname(name) == '.js') {
                if (this.loadPlugin(name)) {
                    log += "succeed load plugin:  " + name + "\n";
                }
            }
        });
        if (log.length == 0) {
            log += "nothing to loading....";
        }
        return log;
    }

    private cleanCache(modulePath: string): void {
        var module = require.cache[modulePath];
        if (module.parent) {
            module.parent.children.splice(module.parent.children.indexOf(module), 1);
        }
        require.cache[modulePath] = null;
    }

    
        //得到所有平台的列表
    public getPlatformFullnameList(): string[]{
        var list = new Array<string>();
        var n:any;
       
       var  platform=JSON.parse(fs.readFileSync("views/platforms.json",'utf-8'));
       for(n in platform){
           list.push(platform[n].fullname);
       }
        return list;
    }

    //平台中文转英文
    public convertFullname(fullname: string): string {
        var n:any;
        var platform=JSON.parse(fs.readFileSync("views/platforms.json",'utf-8'));
        for(n in platform){
            if(platform[n].fullname==fullname){
                return platform[n].name;
            }
        }
        return 'none';
    }

        //平台英文转中文
    public convertToFullname(key: string): string {
        var n: any;
         var platform=JSON.parse(fs.readFileSync("views/platforms.json",'utf-8'));
         for(n in platform){
             if(platform[n].name == key){
                 return platform[n].fullname;
             }
         }
        return 'none';
    }

}

export = ViewManager;
