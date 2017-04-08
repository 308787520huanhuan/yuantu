"use strict";
const pm = require("../scripts/manager");
function checkLogin(req, res, callback) {
    if (req.param("handerClass") != "login" || req.param("handerMethod") != "login") {
        var sessionReq = req.session;
        if (!sessionReq || !sessionReq["user"]) {
            res.send("需要登录");
            return;
        }
    }
    callback();
}
function login(req, res) {
    res.redirect('/views/login/login');
}
exports.login = login;
;
function index(req, res) {
    res.redirect('pc/index.html');
}
exports.index = index;
;
function viewGet(req, res) {
    // checkLogin(req, res, function () {
    //     pm.handle().platforms[req.param("handerClass")][req.param("handerMethod")](req.query, req, res);
    // });
    pm.handle().platforms[req.param("handerClass")][req.param("handerMethod")](req.query, req, res);
}
exports.viewGet = viewGet;
;
function viewPost(req, res) {
    // checkLogin(req, res, function () {
    // });
    pm.handle().platforms[req.param("handerClass")][req.param("handerMethod")](req.body, req, res);
}
exports.viewPost = viewPost;
;
function wxOrder(req, res) {
    var user = req.session['user'];
    if (user == null) {
        req.session['originalUrl'] = req.originalUrl ? req.originalUrl : null;
        res.redirect('wx/login.html');
    }
    else {
        res.redirect("wx/order.html");
    }
}
exports.wxOrder = wxOrder;
//# sourceMappingURL=viewrouter.js.map