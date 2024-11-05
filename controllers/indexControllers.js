const asyncHandler = require("express-async-handler");
const prisma = require("../prisma/client");

const getHomePage = asyncHandler(async (req, res) => {
    const files = await prisma.file.findMany({
        where: { fileId: req.user.id }, // change this later
    });

    res.render("pages/index", { title: "File Uploader", user: req.user, files });
});

module.exports = {
    getHomePage,

};