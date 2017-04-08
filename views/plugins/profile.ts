import util = require("../../scripts/util");
import _ = require('underscore');
import qs = require('qs');
import express = require('express');
import man = require('../scripts/manager');
class Profile {
    constructor() {

    }

    profile(input: any, req: express.Request, res: express.Response): void {
        res.render("pay-admin/home/profile", { "session": req.session["user"] });
    }
}
export =Profile;
