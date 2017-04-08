"use strict";
const express = require("express");
const viewrouter = require("./views/routes/viewrouter");
const OrderListen = require("./views/single/orderListhen");
const http = require("http");
//打印日志
var log4js = require('log4js');
const path = require("path");
var uuid = require('node-uuid');
const fs = require("fs");
const vpm = require("./views/scripts/manager");
const multipart = require("connect-multiparty");
var cookieParser = require('cookie-parser');
//session包
var session = require('express-session');
var app = express();
// all environments
app.set('port', '80');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
//app.use(express.logger(':req[Content-Length]'));
app.use(express.logger('tiny'));
app.use(express.compress());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
// app.use(express.cookieParser("youkownnothing"));
// app.use(express.session());
app.use(cookieParser());
//session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    name: 'yt',
    cookie: { secure: false }
}));
app.use(function (req, res, next) {
    if (req.session.user) {
        next();
    }
    else {
        // 解析用户请求的路径
        var arr = req.url.split('/');
        // 去除 GET 请求路径上携带的参数
        for (var i = 0, length = arr.length; i < length; i++) {
            arr[i] = arr[i].split('?')[0];
        }
        // 如果是去我的订单，则拦截
        if (arr.length > 2 && arr[1] == 'wx' && (arr[2] == 'addUser.html' || arr[2] == "order.html" || arr[2] == "userCenter.html" || arr[2] == "productDetail.html")) {
            req.session.originalUrl = req.originalUrl ? req.originalUrl : null; // 记录用户原始请求路径
            console.log(req.session.originalUrl);
            res.redirect('/wx/login.html'); // 将用户重定向到登录页面
        }
        else {
            next();
        }
    }
});
app.use(app.router);
log4js.configure({
    appenders: [
        {
            type: "file",
            filename: "app.log"
        },
        {
            type: "console"
        }
    ],
    replaceConsole: true
});
const stylus = require("stylus");
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}
// manager init;
console.log(vpm.handle().reloadAllPlugins());
app.get('/', viewrouter.index);
app.get('/views/:handerClass/:handerMethod', viewrouter.viewGet);
app.post('/views/:handerClass/:handerMethod', viewrouter.viewPost);
// app.use(express.static(path.join(__dirname, 'public')));
//文件上传
app.post('/upload', multipart(), function (req, res) {
    //当前登录的用户Id 用以头像命名
    var userId = req.body.userId;
    //get filename
    var filename = req.files.avatar.originalFilename || path.basename(req.files.avatar.path);
    var name = filename.split(".")[1].toLowerCase();
    //Scopy file to a public directory
    var targetPath = path.dirname(__filename) + '/public/avatarImg/' + userId + '.' + name;
    //copy file
    fs.createReadStream(req.files.avatar.path).pipe(fs.createWriteStream(targetPath));
    //return file url
    res.json({ code: 200, msg: { url: 'http://' + req.headers['host'] + '/avatarImg/' + userId + '.' + name } });
});
//编写游记的文件上传
app.post('/uploadArticle', multipart(), function (req, res) {
    //get filename
    var filename = req.files.file.originalFilename || path.basename(req.files.file.path);
    var name = filename.split(".")[1].toLowerCase();
    var num = uuid.v1();
    console.log(req.files);
    //Scopy file to a public directory
    var targetPath = path.dirname(__filename) + '/public/articleImg/' + num + '.' + name;
    //copy file
    fs.createReadStream(req.files.file.path).pipe(fs.createWriteStream(targetPath));
    res.json({ code: 200, msg: { url: 'http://' + req.headers['host'] + '/articleImg/' + num + '.' + name } });
});
//监听待支付的订单
var orderListen = new OrderListen();
orderListen.start();
http.createServer(app).listen(app.get('port'), function () {
    // process.env.TZ = 'Asia/Shanghai';
    console.log("?????????????:" + new Date().toLocaleString());
});
//# sourceMappingURL=sdk_web.js.map