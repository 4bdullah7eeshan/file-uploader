function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated() || req.path === '/sign-in' || req.path === '/sign-up') {
        return next();
    }

    res.redirect("/sign-in");
}

module.exports = { ensureAuthenticated };
