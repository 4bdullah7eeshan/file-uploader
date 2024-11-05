const asyncHandler = require("express-async-handler");
const path = require("path");
const multer = require("multer");
const prisma = require("../prisma/client");

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
    res.render("pages/upload", { title: "Upload", user: req.user });
});

const createFile = asyncHandler(async (req, res) => {
    if (!req.file) {
        req.flash("error", "No file uploaded.");
        return res.redirect("/upload");
    }

    await prisma.file.create({
        data: {
            fileName: req.file.filename,
            userId: req.user.id,
            createdAt: new Date(),
        }
    });

    req.flash("success", "File uploaded successfully.");
    res.redirect("/");
});

module.exports = {
    getUploadPage,
    createFile,
    upload,
};
