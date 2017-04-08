"use strict";
class Profile {
    constructor() {
    }
    profile(input, req, res) {
        res.render("pay-admin/home/profile", { "session": req.session["user"] });
    }
}
module.exports = Profile;
//# sourceMappingURL=profile.js.map