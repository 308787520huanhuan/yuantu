"use strict";
const db = require("../../scripts/db");
const fs = require("fs");
const path = require("path");
class ViewManager {
    constructor() {
        this.platforms = {};
        var data = fs.readFileSync("config.json", 'utf-8');
        this.config = JSON.parse(data);
        this.yuantu_db = new db.Pool(this.config.yuantu_db);
        this.platform_db = this.yuantu_db;
        this.platform_info_db = this.yuantu_db;
        this.nameMap = new Map();
    }
    static handle() {
        if (ViewManager._handle == null) {
            ViewManager._handle = new ViewManager();
        }
        return ViewManager._handle;
    }
    loadPlugin(filename) {
        var name = filename.substring(0, filename.length - 3);
        var mdname = '../plugins/' + filename.substring(0, filename.length - 3);
        if (!this.platforms.hasOwnProperty(name)) {
            var fm = require(mdname);
            this.platforms[name] = new fm();
            return true;
        }
        return false;
    }
    reloadAllPlugins() {
        var log = "";
        var files = fs.readdirSync('./views/plugins/');
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
    cleanCache(modulePath) {
        var module = require.cache[modulePath];
        if (module.parent) {
            module.parent.children.splice(module.parent.children.indexOf(module), 1);
        }
        require.cache[modulePath] = null;
    }
    //得到所有平台的列表
    getPlatformFullnameList() {
        var list = new Array();
        var n;
        var platform = JSON.parse(fs.readFileSync("views/platforms.json", 'utf-8'));
        for (n in platform) {
            list.push(platform[n].fullname);
        }
        return list;
    }
    //平台中文转英文
    convertFullname(fullname) {
        var n;
        var platform = JSON.parse(fs.readFileSync("views/platforms.json", 'utf-8'));
        for (n in platform) {
            if (platform[n].fullname == fullname) {
                return platform[n].name;
            }
        }
        return 'none';
    }
    //平台英文转中文
    convertToFullname(key) {
        var n;
        var platform = JSON.parse(fs.readFileSync("views/platforms.json", 'utf-8'));
        for (n in platform) {
            if (platform[n].name == key) {
                return platform[n].fullname;
            }
        }
        return 'none';
    }
}
ViewManager._handle = null;
module.exports = ViewManager;
//# sourceMappingURL=manager.js.map