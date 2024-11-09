const asyncHandler = require("express-async-handler");
const path = require("path");
const multer = require("multer");
const { PrismaClient } = require('@prisma/client');
const cloudinary = require("../config/cloudinaryConfig");


const prisma = new PrismaClient();

const storage = multer.memoryStorage();


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

    // await prisma.file.create({
    //     data: {
    //         fileName: req.file.filename,
    //         userId: req.user.id,
    //         createdAt: new Date(),
    //         path: `uploads/${req.file.filename}`,
    //         folderId: folderId,
    //     }
    // });

    // await prisma.file.create({
    //     data: {
    //         fileName: req.file.originalname,
    //         userId: req.user.id,
    //         createdAt: new Date(),
    //         cloudinaryUrl: req.file.path, // Cloudinary URL from multer
    //         folderId: folderId,
    //     },
    // });

    // console.log(folderId);

    // req.flash("success", "File uploaded successfully.");
    // res.redirect(folderId ? `/folders/${folderId}` : "/");


    try {
        // Upload the file to Cloudinary
        const result = await cloudinary.uploader.upload_stream(
            { folder: "uploads", resource_type: "auto" }, // Set folder in Cloudinary
            async (error, cloudinaryResult) => {
                if (error) {
                    req.flash("error", "Error uploading file to Cloudinary.");
                    return res.redirect(`/upload${folderId ? `?folderId=${folderId}` : ''}`);
                }

                // Save file information to the database with Cloudinary URL
                await prisma.file.create({
                    data: {
                        fileName: req.file.originalname,
                        userId: req.user.id,
                        createdAt: new Date(),
                        cloudinaryUrl: cloudinaryResult.secure_url, // Cloudinary secure URL
                        folderId: folderId,
                    },
                });

                req.flash("success", "File uploaded successfully.");
                res.redirect(folderId ? `/folders/${folderId}` : "/");
            }
        );

        // Stream the file buffer to Cloudinary
        result.end(req.file.buffer);

    } catch (error) {
        req.flash("error", "Error uploading file.");
        res.redirect(`/upload${folderId ? `?folderId=${folderId}` : ''}`);
    }
});

module.exports = {
    getUploadPage,
    createFile,
    upload,
};
