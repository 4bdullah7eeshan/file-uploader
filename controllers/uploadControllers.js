const asyncHandler = require("express-async-handler");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const getUploadPage = asyncHandler(async (req, res) => {
    res.render("pages/upload", { title: "Upload", user: req.user });
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "../uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const fileExtension = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, fileExtension);
        cb(null, `${baseName}-${uniqueSuffix}${fileExtension}`);
    }
});

const upload = multer({ storage });

const createFile = asyncHandler(async (req, res) => {
    if (!req.file) {
        req.flash("error", "No file uploaded.");
        return res.redirect("/upload");
    }
    res.render("pages/uploadSuccess", { filename: req.file.filename });
});

module.exports = {
    getUploadPage,
    createFile,
    upload
};
