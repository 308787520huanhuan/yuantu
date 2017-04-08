"use strict";
const qs = require("qs");
const crypto = require("crypto");
const uuid = require("node-uuid");
const _ = require("underscore");
const http = require("http");
const https = require("https");
const fs = require("fs");
const url = require("url");
const httpRequest = require("request");
var urlencode = require('urlencode2');
function obj2base64(obj) {
    return base64(JSON.stringify(obj));
}
exports.obj2base64 = obj2base64;
function objFromBase64(data) {
    return JSON.parse(fromBase64(data));
}
exports.objFromBase64 = objFromBase64;
function base64(data) {
    var buf = new Buffer(data);
    return buf.toString('base64').replace('+', '-').replace("\\", '_');
}
exports.base64 = base64;
function fromBase64(data) {
    var buf = new Buffer(data.replace('-', '+').replace('_', "\\"), 'base64');
    return buf.toString();
}
exports.fromBase64 = fromBase64;
//encoding is 'utf8', 'ascii', or 'binary'
function md5(data, encoding = 'utf-8') {
    return crypto.createHash("md5").update(data, encoding).digest("hex");
}
exports.md5 = md5;
function sha1(data) {
    return crypto.createHash("sha1").update(data).digest("hex");
}
exports.sha1 = sha1;
function shortMD5(data) {
    return md5(data).substring(4, 12);
}
exports.shortMD5 = shortMD5;
function fileMD5(filename) {
    var data = fs.readFileSync(filename, 'utf-8');
    return md5(data);
}
exports.fileMD5 = fileMD5;
function randomKey() {
    return md5(uuid.v1());
}
exports.randomKey = randomKey;
function urlEncode(data) {
    return urlencode(data);
}
exports.urlEncode = urlEncode;
function urlDecode(data) {
    return urlencode.decode(data);
}
exports.urlDecode = urlDecode;
function getSign(obj, key, omit = ['sign'], amp = false) {
    var s = '';
    _.chain(obj)
        .omit(v => v == undefined || v == null)
        .omit(omit)
        .pairs()
        .sortBy(x => x[0])
        .forEach(x => {
        s += x[0] + "=" + x[1] + "&";
    });
    if (!amp) {
        s = s.substring(0, s.length - 1);
    }
    s += key;
    return md5(s);
}
exports.getSign = getSign;
function httpGet(_url, callback) {
    http.get(_url, res => {
        var recv = "";
        res.on('data', function (data) {
            recv += data;
        });
        res.on('end', function () {
            callback(recv);
        });
    });
}
exports.httpGet = httpGet;
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
exports.httpsGet = httpsGet;
function httpPost(_url, content, callback) {
    var u = url.parse(_url);
    var opt = {
        'method': "POST",
        'host': u.host,
        'port': u.port,
        'path': u.path,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': content.length
        }
    };
    var req = http.request(opt, function (res) {
        var recv_data = "";
        res.on('data', function (data) {
            recv_data += data;
        });
        res.on('end', function () {
            callback(recv_data);
        });
    });
    req.write(content);
    req.end();
}
exports.httpPost = httpPost;
function httpPostForm(_url, content, callback) {
    httpRequest.post(_url, {
        form: content
    }, function (err, res, body) {
        callback(body);
    });
}
exports.httpPostForm = httpPostForm;
function extract(obj, keys) {
    var out = {};
    _.chain(keys).each(key => {
        if (obj.hasOwnProperty(key)) {
            out[key] = obj[key];
        }
        else {
            out[key] = "";
        }
    });
    return out;
}
exports.extract = extract;
function checkSign(obj, key) {
    if (obj.hasOwnProperty("sign")) {
        return obj["sign"] == getSign(obj, key);
    }
    return false;
}
exports.checkSign = checkSign;
function checkQuerySign(query, key) {
    return checkSign(qs.parse(query), key);
}
exports.checkQuerySign = checkQuerySign;
// 从当日凌晨算起的倒数几个小时, 倒数为负
function lastHour(hour) {
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    date.addHours(hour);
    return date;
}
exports.lastHour = lastHour;
// 从当日凌晨算起的倒数几天, 倒数为负
function lastDay(day) {
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    date.addDays(day);
    return date;
}
exports.lastDay = lastDay;
//# sourceMappingURL=util.js.map