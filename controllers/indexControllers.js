const asyncHandler = require("express-async-handler");

const getHomePage = asyncHandler(async (req, res) => {
    res.render("pages/index", { title: "Members Only" });
});


module.exports = {
    getHomePage,

};