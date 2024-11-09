const asyncHandler = require("express-async-handler");
const path = require("path");
const multer = require("multer");
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const fileExtension = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, fileExtension);
        cb(null, `${baseName}-${uniqueSuffix}${fileExtension}`);
    }
});

const upload = multer({ storage: storage });

const getUploadPage = asyncHandler(async (req, res) => {
    const folderId = req.query.folderId ? parseInt(req.query.folderId) : null;
    res.render("pages/upload", { title: "Upload", user: req.user, folderId });
});

const createFile = asyncHandler(async (req, res) => {
    console.log("Folder ID:", req.body.folderId);

    const folderId = req.body.folderId ? parseInt(req.body.folderId) : null;

    if (!req.file) {
        req.flash("error", "No file uploaded.");
        return res.redirect(`/upload${folderId ? `?folderId=${folderId}` : ''}`);

    }

    await prisma.file.create({
        data: {
            fileName: req.file.filename,
            userId: req.user.id,
            createdAt: new Date(),
            path: `uploads/${req.file.filename}`,
            folderId: folderId,
        }
    });

    console.log(folderId);

    req.flash("success", "File uploaded successfully.");
    res.redirect(folderId ? `/folders/${folderId}` : "/");
});

module.exports = {
    getUploadPage,
    createFile,
    upload,
};
