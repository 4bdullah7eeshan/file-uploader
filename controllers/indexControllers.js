const asyncHandler = require("express-async-handler");
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getHomePage = asyncHandler(async (req, res) => {
    const files = await prisma.file.findMany({
        where: { userId: req.user.id },
    });

    res.render("pages/index", { title: "File Uploader", user: req.user, files });
});

module.exports = {
    getHomePage,

};