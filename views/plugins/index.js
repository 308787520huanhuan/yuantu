"use strict";
const fs = require("fs");
const ytRaidersSql = require("../mysql/ytRaidersSql");
const https = require("https");
// import Login = require("./login");
const UserAuthsSql = require("../mysql/userAuthsSql");
const UserSql = require("../mysql/userSql");
const TransactionLogSql = require("../mysql/transactionLogSql");
var uuid = require('node-uuid');
var pingpp = require('pingpp')('sk_live_m1iHy1GCOyXHmLOW90CGaLS0');
pingpp.setPrivateKeyPath(process.cwd() + "/yt_rsa_private_key.pem");
function httpsGet(_url, callback) {
    https.get(_url, res => {
        var recv = "";
        res.on('data', function (data) {
            recv += data;
        });
        res.on('end', function () {
            callback(recv);
        });
    });
}
function getClientIP(req) {
    var ipAddress;
    var headers = req.headers;
    var forwardedIpsStr = headers['x-real-ip'] || headers['x-forwarded-for'];
    forwardedIpsStr ? ipAddress = forwardedIpsStr : ipAddress = null;
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
}
function redirectOnLoginSuccess(req, res, user) {
    var redirectUrl = null;
    req.session.user = user; // 将用户信息写入 session
    if (req.session.originalUrl) {
        redirectUrl = req.session.originalUrl;
        req.session.originalUrl = null; // 清空 session 中存储的原始请求路径
    }
    else {
        redirectUrl = '/';
    }
    //如果原链接里面已经存在参数 
    if (redirectUrl.indexOf("?") == -1) {
        redirectUrl += "?";
    }
    else {
        redirectUrl += "&";
    }
    redirectUrl += 'uid=' + user.id;
    res.redirect(redirectUrl);
}
class Index {
    constructor() {
    }
    //删除游记
    deleteArticle(input, req, res) {
        var raidersList = new ytRaidersSql();
        var id = input['id'];
        raidersList.deleteArticleContent(id).then(data => {
            raidersList.deleteArticle(id).then(data => {
                var obj = {};
                obj['code'] = 200;
                res.send(obj);
            });
        });
    }
    deleteCollection(input, req, res) {
        var raidersList = new ytRaidersSql();
        var id = input['id'];
        raidersList.deleteCollection(id).then(data => {
            var obj = {};
            obj['code'] = 200;
            res.send(obj);
        });
    }
    //deleteClient
    deleteClient(input, req, res) {
        var raidersList = new ytRaidersSql();
        var id = input['id'];
        raidersList.deleteClient(id).then(data => {
            var obj = {};
            obj['code'] = 200;
            res.send(obj);
        });
    }
    //获得用户信息
    getUserInfo(input, req, res) {
        var raidersList = new ytRaidersSql();
        raidersList.getUserInfo(input['userId']).then(data => {
            res.send(data);
        });
    }
    //获得游记详情
    getArticleInfo(input, req, res) {
        var raidersList = new ytRaidersSql();
        raidersList.getArticleInfo(input['articleId']).then(data => {
            var sendData = data[0];
            raidersList.getArticleContentInfo(input['articleId']).then(data => {
                sendData['code'] = 200;
                sendData['content'] = data;
                res.send(sendData);
            });
        });
    }
    //删除某一个文件
    deleteFile(input, req, res) {
        //上一次的图片
        var url = input['url'];
        if (url) {
            fs.unlink('public' + url, function (err) {
                if (err) {
                    throw err;
                }
                else {
                    var data = {};
                    data['code'] = 200;
                    res.send(data);
                }
            });
        }
    }
    //获得意见反馈列表
    getFeedbackList(input, req, res) {
        var raidersList = new ytRaidersSql();
        //先获得列表
        raidersList.getFeedbackList(input['userId']).then(data => {
            res.send(data);
        });
    }
    //获得游记
    getArticleList(input, req, res) {
        var raidersList = new ytRaidersSql();
        //先获得列表
        raidersList.getArticleList(input['userId']).then(data => {
            res.send(data);
        });
    }
    //获得联系人详情
    getClientInfo(input, req, res) {
        var raidersList = new ytRaidersSql();
        //先获得列表
        raidersList.getClientInfo(input['id']).then(data => {
            var sendDate = data[0];
            sendDate['code'] = 200;
            res.send(sendDate);
        });
    }
    //添加意见反馈列表
    addFeedback(input, req, res) {
        var raidersList = new ytRaidersSql();
        var para = {};
        for (var option in input) {
            para[option] = input[option];
        }
        //先获得列表
        raidersList.addFeedback(para).then(data => {
            var sendData = {};
            sendData['code'] = 200;
            res.send(sendData);
        });
    }
    //添加收藏夹
    addToCollection(input, req, res) {
        var raidersList = new ytRaidersSql();
        var activityId = input['activity_id'];
        var para = {};
        for (var option in input) {
            para[option] = input[option];
        }
        raidersList.getCollection(input['user_id']).then(data => {
            data = data;
            var flag = false;
            for (var i = 0; i < data.length; i++) {
                console.log(data[i]['activity_id']);
                if (activityId == data[i]['activity_id']) {
                    console.log("????????????");
                    flag = true;
                }
            }
            //已经存在
            if (flag) {
                var sendData = {};
                sendData['code'] = 200;
                sendData['info'] = "已经收藏过该活动";
                res.send(sendData);
            }
            else {
                raidersList.addToCollection(para).then(data => {
                    var sendData = {};
                    sendData['code'] = 200;
                    sendData['info'] = "收藏成功";
                    res.send(sendData);
                });
            }
        });
    }
    //点赞
    up(input, req, res) {
        var raidersList = new ytRaidersSql();
        var para = {};
        for (var option in input) {
            para[option] = input[option];
        }
        raidersList.isUpYet(input['user_id'], input['obj_id'], input['type']).then(data => {
            console.log("是否已经点赞过");
            console.log(data);
            //已经存在了
            if (data.length > 0) {
                var sendData = {};
                sendData['code'] = 201;
                sendData['info'] = "同一个账号只能点赞一次";
                res.send(sendData);
            }
            else {
                //往点赞列表加数据
                raidersList.addUp(para).then(data => {
                    if (para['type'] == 1) {
                        raidersList.addOrminus("add", "activity", "up", { "id": para['obj_id'] }).then(data => {
                            var sendData = {};
                            sendData['code'] = 200;
                            sendData['info'] = "点赞成功";
                            res.send(sendData);
                        });
                    }
                    else {
                        raidersList.addOrminus("add", "comment", "up", { "id": para['obj_id'] }).then(data => {
                            var sendData = {};
                            sendData['code'] = 200;
                            sendData['info'] = "点赞成功";
                            res.send(sendData);
                        });
                    }
                });
            }
            //已经存在
            // if(flag){
            //     var sendData = {};
            //     sendData['code'] = 200;
            //     sendData['info'] = "已经收藏过该活动";
            //     res.send(sendData)
            // }else{
            //     raidersList.addToCollection(para).then(data => {
            //         var sendData = {};
            //         sendData['code'] = 200;
            //         sendData['info'] = "收藏成功";
            //         res.send(sendData)
            //     });
            // }
        });
    }
    //编辑用户信息
    editUserInfo(input, req, res) {
        var raidersList = new ytRaidersSql();
        //先获得列表
        raidersList.editUserInfo(input).then(data => {
            var senData = {};
            senData['code'] = 200;
            senData['data'] = data;
            res.send(senData);
        });
    }
    //获得有用户信息的攻略列表
    raidersList(input, req, res) {
        var raidersList = new ytRaidersSql();
        //先获得列表
        raidersList.getRaidersList().then(data => {
            res.send(data);
        });
    }
    //订单列表
    orderList(input, req, res) {
        var raidersList = new ytRaidersSql();
        //先获得列表
        raidersList.getOrderList(input['status'], input['userId']).then(data => {
            res.send(data);
        });
    }
    //增加浏览量
    addRaiderView(input, req, res) {
        var raidersList = new ytRaidersSql();
        var id = input['id'];
        //先获得列表
        raidersList.getRaiderInfo(id).then(data => {
            console.info(data);
            var num = data[0]['count_of_view'];
            raidersList.addCountOfView(id, 'travel_raiders', num + 1).then(data => {
                res.send(data);
            });
        });
    }
    //立即出发 活动列表
    getActivityList(input, req, res) {
        var activityList = new ytRaidersSql();
        //先获得列表
        activityList.getActivityList().then(data => {
            res.send(data);
        });
    }
    //收藏列表
    getCollection(input, req, res) {
        var activityList = new ytRaidersSql();
        //先获得列表
        activityList.getCollection(input['id']).then(data => {
            res.send(data);
        });
    }
    //微信端微官网首页的为您推荐（活动风采、团队风采、领队风采）
    getRecommendList(input, req, res) {
        var recommendList = new ytRaidersSql();
        //先获得列表
        recommendList.getRecommendList().then(data => {
            res.send(data);
        });
    }
    editUserClientInfo(input, req, res) {
        var recommendList = new ytRaidersSql();
        var para = {};
        for (var option in input) {
            para[option] = input[option];
        }
        //先获得列表
        recommendList.editUserClientInfo(para).then(data => {
            res.send(data);
        });
    }
    addUserClientInfo(input, req, res) {
        var recommendList = new ytRaidersSql();
        var para = {};
        for (var option in input) {
            para[option] = input[option];
        }
        //先获得列表
        recommendList.addUserClientInfo(para).then(data => {
            res.send(data);
        });
    }
    //获取当前登录的用户的顾客列表
    getUserClientList(input, req, res) {
        var recommendList = new ytRaidersSql();
        var userId = input.userId;
        //先获得列表
        recommendList.getUserClientList(userId).then(data => {
            res.send(data);
        });
    }
    //下单时 选择的用户列表
    getUserClientInfo(input, req, res) {
        var recommendList = new ytRaidersSql();
        var para = input.userIdArr;
        //先获得列表
        recommendList.getUserClientInfo(para).then(data => {
            res.send(data);
        });
    }
    //下单时 活动的套餐列表
    getpackageList(input, req, res) {
        var recommendList = new ytRaidersSql();
        var para = input.activityId;
        //先获得列表
        recommendList.getpackageList(para).then(data => {
            res.send(data);
        });
    }
    //获得商品列表
    getGoodsList(input, req, res) {
        var recommendList = new ytRaidersSql();
        //先获得列表
        recommendList.getGoodsList().then(data => {
            res.send(data);
        });
    }
    //获得活动详情
    getActivityInfo(input, req, res) {
        var recommendList = new ytRaidersSql();
        var sendData = {};
        //再请求详情
        recommendList.getActivityInfo(input.id).then(data => {
            var response = {};
            response = data[0];
            recommendList.addCountOfView(input.id, 'activity', response['count_of_view'] + 1).then(data => {
                //请求活动套餐
                recommendList.getpackageList(input.id).then(data => {
                    response['package'] = data;
                    sendData['info'] = response;
                    //请求活动的评价列表
                    recommendList.getCommentList(input.id).then(data => {
                        sendData['comment'] = data;
                        res.send(sendData);
                    });
                });
            });
        });
    }
    //生成游记
    addArticle(input, req, res) {
        var recommendList = new ytRaidersSql();
        var para = {};
        var topInfo = input["toInfo"];
        for (var option in topInfo) {
            if (option != "content") {
                para[option] = topInfo[option];
            }
        }
        recommendList.addArticle(para).then(data => {
            var insertId = data['insertId'];
            var content = input['content'];
            var arrData = [];
            for (var i = 0; i < content.length; i++) {
                var tmp = content[i];
                tmp['article_id'] = insertId;
                arrData.push(tmp);
            }
            recommendList.addArticleContent(arrData).then(data => {
                var obj = {};
                obj['code'] = 200;
                obj['insertId'] = insertId;
                res.send(obj);
            });
        });
    }
    editArticle(input, req, res) {
        var recommendList = new ytRaidersSql();
        var para = {};
        //基本信息部分
        var topInfo = input["toInfo"];
        var addData = input["addData"];
        var delDate = input["delDate"];
        var updateData = input["updateData"];
        for (var option in topInfo) {
            para[option] = topInfo[option];
        }
        //先更新文章基本信息
        recommendList.updateArticle(para).then(data => {
            if (addData && addData.length > 0) {
                //批量添加
                recommendList.addArticleContent(addData).then(data => {
                    console.log(data);
                });
            }
            if (delDate && delDate.length > 0) {
                //批量删除
                recommendList.deleteArr(delDate.join(","), "articles_content").then(data => {
                    console.log(data);
                });
            }
            if (updateData && updateData.length > 0) {
                //批量更新
                recommendList.updateArr(updateData, "articles_content").then(data => {
                    console.log(data);
                });
            }
            setTimeout(function () {
                var sendData = {};
                sendData['code'] = 200;
                res.send(sendData);
            }, 5000);
        });
    }
    //提交订单
    addOrder(input, req, res) {
        //uuid.v1() 基于时间生成的随机数 .v4()随机生成
        var recommendList = new ytRaidersSql();
        //活动的ID
        var activity_id = input.activity_id;
        var para = {};
        para['number'] = uuid.v1();
        for (var option in input) {
            if (option != "counponId") {
                para[option] = input[option];
            }
        }
        //先添加订单
        recommendList.addOrder(para).then(data => {
            //活动的已售数量加一
            recommendList.addOrminus("add", "activity", "solded", { "id": activity_id }).then(data => {
                console.log(input.counponId);
                if (input.counponId) {
                    var counponId = input.counponId;
                    //更改优惠券的状态
                    recommendList.changeCounponStatus(counponId).then(data => {
                        res.send({ code: 200 });
                    });
                }
                else {
                    res.send({ code: 200 });
                }
            });
        });
    }
    login(input, req, res) {
        // var login = new Login();
        // login._weixinAuthLogin(input,req,res);
        //检查用户是否已经登录
        var user = req.session['user'];
        var appId = "wx9d877ae5809a128c";
        var appSecret = "121bd26fe09847798c5cacd5da270e7a";
        // var url = "https://api.weixin.qq.com/sns/oauth2/access_token?"+
        // "appid="+appId+
        // "&secret="+appSecret+
        // "&code="+input.code+
        // "&grant_type=authorization_code";
        httpsGet("https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + appId + "&secret=" + appSecret + "&code=" + input.code + "&grant_type=authorization_code", function (data) {
            var dataobj = JSON.parse(data);
            if (dataobj["errcode"]) {
                res.send({ "result": dataobj["errcode"], "message": dataobj['errmsg'] });
            }
            else {
                var openid = dataobj['openid'];
                var source = "weixin";
                var access_token = dataobj['access_token'];
                //缓存openid
                req.session['open_id'] = openid;
                //第一次授权
                var url = "https://api.weixin.qq.com/sns/userinfo?access_token=" + access_token + "&openid=" + openid + "&lang=zh_CN";
                httpsGet(url, function (data) {
                    var dataobj = JSON.parse(data);
                    if (dataobj["errcode"]) {
                        res.send({ "result": dataobj["errcode"], "message": dataobj['errmsg'] });
                    }
                    else {
                        var userAuthsql = new UserAuthsSql();
                        userAuthsql.getUserAuthsBySourceAndOId(source, openid).then(userAuths => {
                            var usersql = new UserSql();
                            var userAuth = userAuths[0];
                            if (userAuth) {
                                usersql.getUsers(userAuth["user_id"]).then(users => {
                                    var user = users[0];
                                    if (user) {
                                        // req.session['user'] = user;
                                        // res.send({"result":0, "message":"用户登录成功","uid":user['id']});
                                        redirectOnLoginSuccess(req, res, user);
                                    }
                                    else {
                                        res.send({ "result": 1, "message": "用户不存在" });
                                    }
                                });
                            }
                            else {
                                //第一次授权
                                user = { nickname: dataobj.nickname, sex: dataobj.sex, avatar: dataobj.headimgurl };
                                usersql.insertData(user).then(result => {
                                    if (result['affectedRows'] == 1) {
                                        var uid = result['insertId'];
                                        usersql.getUsers(uid).then(users => {
                                            var user = users[0];
                                            if (user) {
                                                // req.session['user'] = user;
                                                userAuth = { user_id: uid, oid: openid, source: source };
                                                userAuthsql.insertData(userAuth);
                                                // res.send({"result":0, "message":"用户登录成功","uid":uid});
                                                redirectOnLoginSuccess(req, res, user);
                                            }
                                            else {
                                                res.send({ "result": 1, "message": "用户不存在" });
                                            }
                                        });
                                    }
                                    else {
                                        res.send({ "result": 0, "message": "创建用户失败" });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    _doWxPay(input, req, res) {
        var orderId = input.orderId;
        var amount = input.amount;
        var channel = input.channel;
        //微信支付
        var extra = {
            // limit_pay:optional,string
            // 指定支付方式，指定不能使用信用卡支付可设置为  no_credit 。
            // goods_tag:optional,string
            // 商品标记，代金券或立减优惠功能的参数。
            open_id: req.session['open_id']
        };
        pingpp.charges.create({
            order_no: orderId,
            app: { id: "app_OyHizDfnTaT4Si9e" },
            channel: channel,
            amount: amount * 100,
            client_ip: getClientIP(req),
            currency: "cny",
            subject: "远徒活动",
            body: "远徒活动支付",
            extra: extra
        }, function (err, charge) {
            // // YOUR CODE
            if (err != null) {
                res.send({ error: err });
            }
            else {
                var transLogSql = new TransactionLogSql();
                var trans = {
                    id: orderId,
                    user_id: req.session['user'].id,
                    money: amount,
                    payment: channel,
                    status: 0,
                    oid: charge['id'],
                };
                transLogSql.insertData(trans).then(data => {
                    res.send({ charge: charge });
                });
            }
        });
    }
    _doAliPay(input, req, res) {
        var orderId = input.orderId;
        var amount = input.amount;
        var channel = input.channel;
        //支付宝支付
        var extra = {
            success_url: "http://iyuantu.cn/wx/order.html",
            // REQUIRED
            // string
            // 支付成功的回调地址。
            cancel_url: "http://iyuantu.cn/wx/order.html",
        };
        pingpp.charges.create({
            order_no: orderId,
            app: { id: "app_OyHizDfnTaT4Si9e" },
            channel: channel,
            amount: amount * 100,
            client_ip: getClientIP(req),
            currency: "cny",
            subject: "远徒活动",
            body: "远徒活动支付",
            extra: extra
        }, function (err, charge) {
            // // YOUR CODE
            if (err != null) {
                res.send({ error: err });
            }
            else {
                var transLogSql = new TransactionLogSql();
                var trans = {
                    id: orderId,
                    user_id: req.session['user'].id,
                    money: amount,
                    payment: channel,
                    status: 0,
                    oid: charge['id'],
                };
                transLogSql.insertData(trans).then(data => {
                    res.send({ charge: charge });
                });
            }
        });
    }
    //订单支付
    pay(input, req, res) {
        var orderId = input.orderId;
        var amount = input.amount;
        var channel = input.channel;
        switch (channel) {
            case "wx_pub":
                this._doWxPay(input, req, res);
                break;
            case "alipay_wap":
                this._doAliPay(input, req, res);
                break;
        }
    }
    //PC端的注册
    pcRegister(input, req, res) {
        var phone = input.phone;
        var password = input.password;
        var raidersList = new ytRaidersSql();
        // raidersList.hasUserOrNot(phone).then(data => 
        // {
        //     console.log(data)
        // })
    }
    getCounponList(input, req, res) {
        var userId = input.userId;
        var raidersList = new ytRaidersSql();
        raidersList.getCounponList(userId).then(data => {
            res.send(data);
        });
    }
    //取消订单
    cancelOrder(input, req, res) {
        var orderId = input.orderId;
        var activityId = input.activityId;
        var raidersList = new ytRaidersSql();
        raidersList.cancelOrder(orderId).then(data => {
            if (data['affectedRows'] == 1) {
                // raidersList.soldM(activityId).then(data => 
                raidersList.addOrminus("minus", "activity", "solded", { "id": activityId }).then(data => {
                    if (data['affectedRows'] == 1) {
                        res.send({ 'code': 200 });
                    }
                });
            }
        });
    }
    //删除订单
    deleteOrder(input, req, res) {
        var orderId = input.orderId;
        var raidersList = new ytRaidersSql();
        raidersList.deleteOrder(orderId).then(data => {
            res.send({ 'code': 200 });
        });
    }
    //评论
    saveRecommend(input, req, res) {
        var recommendList = new ytRaidersSql();
        var para = {}, orderId;
        for (var option in input) {
            if (option == "orderId") {
                orderId = input[option];
            }
            else {
                para[option] = input[option];
            }
        }
        recommendList.addComment(para).then(data => {
            recommendList.changeStatus("orders", orderId, 4).then(data => {
                res.send({ 'code': 200 });
            });
        });
    }
    //确认行程结束
    sureFinish(input, req, res) {
        var orderId = input.orderId;
        var raidersList = new ytRaidersSql();
        raidersList.sureFinish(orderId).then(data => {
            res.send({ 'code': 200 });
        });
    }
    //取消订单
    isFirstOrder(input, req, res) {
        var raiderSql = new ytRaidersSql();
        var userId = input.userId;
        var orderId = input.orderId;
        var endtime = input.endtime;
        var add_time = input.add_time;
        raiderSql.isFirstOrder(userId).then(data => {
            if (data.length == 1) {
                //是首单
                raiderSql.giveCounpon({ "type": 1, "userId": userId, "money": 5, "addTime": add_time }).then(data => {
                    res.send({ 'code': 200, 'isFirstOrder': true });
                });
            }
            else {
                res.send({ 'code': 200, 'isFirstOrder': false });
            }
        });
    }
    payCallback(input, req, res) {
        var transLogSql = new TransactionLogSql();
        // transLogSql.updateData({"status":1,"oid":"ch_4unvn1X10WTOLiHuLSWrXT40"})
        var resp = function (ret, status_code) {
            res.writeHead(status_code, {
                "Content-Type": "text/plain; charset=utf-8"
            });
            res.end(ret);
        };
        var body = req.body;
        // transLogSql.updateData({"status":2,"oid":"ch_4unvn1X10WTOLiHuLSWrXT40"})
        if (body['type'] != "charge.succeeded") {
            resp(body['type'], 400);
            return;
        }
        // transLogSql.updateData({"status":3,"oid":"ch_4unvn1X10WTOLiHuLSWrXT40"})
        var ob = body['data']['object'];
        var paid = ob['paid'];
        if (paid != 1 && paid != true) {
            resp("未支付", 400);
            return;
        }
        var chargeId = ob['id'];
        // var transLogSql = new TransactionLogSql();
        transLogSql.getTransactions(chargeId).then(function (transLogs) {
            var transLog = transLogs[0];
            if (transLog) {
                if (ob['order_no'] == transLog.id) {
                    //更新交易记录状态
                    var params = { "status": 1, "oid": chargeId };
                    transLogSql.updateData(params);
                    //更新订单状态
                    var raiderSql = new ytRaidersSql();
                    var userId = transLog.user_id;
                    var add_time = transLog.add_time;
                    raiderSql.updateOrder({ "status": 2, "id": transLog.id }).then(data => {
                        resp("OK", 200);
                        return;
                    });
                }
            }
            resp("更新订单失败", 400);
        });
    }
    chargeRetrieve(input, req, res) {
        var chargeId = input.chargeId;
        pingpp.charges.retrieve(chargeId, function (err, charge) {
            // YOUR CODE
            if (err == null) {
                //  var transLogSql = new TransactionLogSql();
                //  transLogSql.getTransactions(chargeId).then(function(transLogs) {
                //     var transLog = transLogs[0];
                //     if (transLog && transLog) {
                //     }
                // });
                if (charge['paid'] == 1 || charge['paid'] == true) {
                    res.send({ 'code': 0, "message": "支付完成", "redirect": 'http://iyuantu.cn/wx/order.html' });
                }
                else {
                    res.send({ 'code': 1, "message": "支付失败", "redirect": 'http://iyuantu.cn/wx/order.html' });
                }
            }
        });
    }
    index(input, req, res) {
        res.render("pay-admin/home/index", { "session": req.session["user"] });
    }
}
module.exports = Index;
//# sourceMappingURL=index.js.map