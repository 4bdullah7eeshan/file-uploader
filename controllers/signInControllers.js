const asyncHandler = require("express-async-handler");

const getSignInPage = asyncHandler(async (req, res) => {
    res.render("pages/signIn", { title: "Sign in", user: req.user });
});


module.exports = {
    getSignInPage,

};