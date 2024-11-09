const asyncHandler = require("express-async-handler");
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getHomePage = asyncHandler(async (req, res) => {
    const files = await prisma.file.findMany({
        where: { userId: req.user.id,
            folderId: null,
         },
         select: { id: true, fileName: true, createdAt: true, cloudinaryUrl: true },

    });

    const folders = await prisma.folder.findMany({
        where: { userId: req.user.id,
            parentId: null,
         },
    });

    res.render("pages/index", { title: "File Uploader", user: req.user, files, folders });
});

module.exports = {
    getHomePage,

};