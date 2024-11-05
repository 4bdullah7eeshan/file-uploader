const asyncHandler = require("express-async-handler");

const getHomePage = asyncHandler(async (req, res) => {
    res.render("pages/index", { title: "File Uploader" });
});


module.exports = {
    getHomePage,

};