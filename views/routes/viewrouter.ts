import express = require('express');
import qs = require('qs');
import _ = require('underscore');
import pm = require('../scripts/manager');

function checkLogin(req: express.Request, res: express.Response, callback: Function) {
    if (req.param("handerClass") != "login" || req.param("handerMethod") != "login") {
        var sessionReq = req.session;
        if (!sessionReq||!sessionReq["user"]) {
            res.send("需要登录");
            return;
        }
    }
    callback();
}

export function login(req: express.Request, res: express.Response) {
    res.redirect('/views/login/login')
};
export function index(req: express.Request, res: express.Response) {
    res.redirect('pc/index.html')
};

export function viewGet(req: express.Request, res: express.Response) {
    // checkLogin(req, res, function () {

    //     pm.handle().platforms[req.param("handerClass")][req.param("handerMethod")](req.query, req, res);
    // });
    pm.handle().platforms[req.param("handerClass")][req.param("handerMethod")](req.query, req, res);
};

export function viewPost(req: express.Request, res: express.Response) {
    // checkLogin(req, res, function () {
        
    // });
    pm.handle().platforms[req.param("handerClass")][req.param("handerMethod")](req.body, req, res);
};


export function wxOrder(req: express.Request, res: express.Response) {
    var user = req.session['user'];
    if (user == null) {
        req.session['originalUrl'] = req.originalUrl ? req.originalUrl : null;
        res.redirect('wx/login.html');
    } else {
        res.redirect("wx/order.html");
    }
}