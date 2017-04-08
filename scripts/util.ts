import qs = require('qs');
import crypto = require('crypto');
import uuid = require('node-uuid');
import _ = require('underscore');
import http = require('http');
import https = require('https');
import fs = require('fs');
import path = require('path');
import url = require('url');
import httpRequest = require('request');
var urlencode = require('urlencode2');

export interface IMap<T> {
    [index: string]: T;
}

export function obj2base64(obj: any): string {
    return base64(JSON.stringify(obj));
}

export function objFromBase64(data: string): any {
    return JSON.parse(fromBase64(data));
}

export function base64(data: string): string {
    var buf = new Buffer(data);
    return buf.toString('base64').replace('+', '-').replace("\\", '_'); 
}

export function fromBase64(data: string): string {
    var buf = new Buffer(data.replace('-', '+').replace('_', "\\"), 'base64');
    return buf.toString();
}


//encoding is 'utf8', 'ascii', or 'binary'
export function md5(data: string, encoding: string = 'utf-8'): string {
    return crypto.createHash("md5").update(data, encoding).digest("hex");
}

export function sha1(data: string): string {
    return crypto.createHash("sha1").update(data).digest("hex");
}

export function shortMD5(data: string): string {
    return md5(data).substring(4, 12);
}

export function fileMD5(filename: string) : string {
    var data = fs.readFileSync(filename, 'utf-8');
    return md5(data);
}

export function randomKey(): string {
    return md5(uuid.v1());
}

export function urlEncode(data: string): string {
    return urlencode(data);
}

export function urlDecode(data: string): string {
    return urlencode.decode(data);
}

export function getSign(obj: any, key: string, omit: Array<string> = ['sign'], amp: boolean = false): string {
    var s: string = '';
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

export function httpGet(_url: string, callback: (data: string) => void): void{
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

export function httpsGet(_url: string, callback: (data: string) => void): void{
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

export function httpPost(_url: string, content: string, callback: (data: string) => void): void {
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

export function httpPostForm(_url: string, content: any, callback: (data: string) => void): void {
    httpRequest.post(_url,
        {
            form: content
        }
        , function (err, res, body) {
            callback(body);
        }
    );
}

export function extract(obj: any, keys: Array<string>): any {
    var out = {};
    _.chain(keys).each(key => {
        if (obj.hasOwnProperty(key)) {
            out[key] = obj[key];
        } else {
            out[key] = "";
        }
    });
    return out;
}

export function checkSign(obj: any, key: string): boolean {
    if (obj.hasOwnProperty("sign")) {
        return obj["sign"] == getSign(obj, key);
    }
    return false;
}

export function checkQuerySign(query: string, key: string): boolean {
    return checkSign(qs.parse(query), key);
}

// 从当日凌晨算起的倒数几个小时, 倒数为负
export function lastHour(hour: number): Date {
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    date.addHours(hour);
    return date;
}

// 从当日凌晨算起的倒数几天, 倒数为负
export function lastDay(day: number): Date {
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    date.addDays(day);
    return date;
}