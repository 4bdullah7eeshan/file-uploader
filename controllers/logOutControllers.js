const asyncHandler = require("express-async-handler");

const logOut = asyncHandler(async (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }
            res.redirect("/");
        });
    });
});

module.exports = {
    logOut,
};
