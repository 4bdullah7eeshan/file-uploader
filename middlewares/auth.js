function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated() || req.path === '/sign-in' || req.path === '/sign-up') {
        return next();
    }

    res.redirect("/sign-in");
}

function setUser(req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.user = req.user || null;
    next();
}

module.exports = { ensureAuthenticated, setUser };
