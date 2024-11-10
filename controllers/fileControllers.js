const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cloudinary = require("../config/cloudinaryConfig");
const asyncHandler = require("express-async-handler");


const getFileDetails = asyncHandler(async (req, res) => {
    const file = await prisma.file.findUnique({
        where: { id: parseInt(req.params.id) }
    });
    res.render("pages/fileDetail", { file, user: req.user });
});

const downloadFile = asyncHandler(async (req, res) => {
    const file = await prisma.file.findUnique({
        where: { id: parseInt(req.params.id) }
    });

    if (!file || !file.cloudinaryUrl) {
        return res.status(404).json({ error: "File not found" });
    }

    // Redirect to Cloudinary file URL for download
    res.redirect(file.cloudinaryUrl);
});

const deleteFile = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        console.log(`Attempting to delete file with ID: ${id} for user ID: ${userId}`);

        // Find file in Prisma
        const file = await prisma.file.findFirst({
            where: { id: Number(id), userId },
        });
        
        if (!file) {
            return res.status(404).json({ error: "File not found or access denied" });
        }

        // Delete from Cloudinary
        if (file.cloudinaryUrl) {
            const publicId = file.cloudinaryUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        // Delete from Prisma
        await prisma.file.delete({
            where: { id: Number(id) },
        });

        res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting file" });
    }
});



module.exports = {
    getFileDetails,
    downloadFile,
    deleteFile
};
