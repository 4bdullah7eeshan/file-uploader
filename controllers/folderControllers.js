const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cloudinary = require("../config/cloudinaryConfig");

const createFolder = async (req, res) => {
    const { name, parentId } = req.body;
    const userId = req.user.id;
    console.log(name);
    
    try {
        const folder = await prisma.folder.create({
            data: {
                name: name,
                userId: userId,
                parentId: parentId ? Number(parentId) : null,
                createdAt: new Date(),
            },
        });
        res.status(201).json(folder);
    } catch (error) {
        console.error("Error creating folder:", error);

        res.status(500).json({ error: "Error creating folder" });
    }
};

const getFolders = async (req, res) => {
    const userId = req.user.id;

    try {
        const folders = await prisma.folder.findMany({
            where: { userId, parentId: null },
            include: { subfolders: true, files: true },
        });
        res.render('pages/index', {
            folders: folders,
            title: 'Your Storage',
        });
    } catch (error) {
        res.status(500).json({ error: "Error retrieving folders" });
    }
};

const getFolderById = async (req, res) => {
    // const { id } = req.params;
    // const userId = req.user.id;

    // try {
    //     const folder = await prisma.folder.findFirst({
    //         where: { id: Number(id), userId },
    //         include: { files: true, subfolders: true },
    //     });
    //     if (!folder) {
    //         return res.status(404).json({ error: "Folder not found" });
    //     }
    //     res.render("index", { folders: folder.subfolders, files: folder.files });
    // } catch (error) {

    // }

    // //     res.json({ folder, files: folder.files, subfolders: folder.subfolders });
    // // } catch (error) {
    // //     res.status(500).json({ error: "Error retrieving folder contents" });
    // // }
    // res.render("index", { folders: folder.subfolders, files: folder.files });

    // const folderId = parseInt(req.params.id);
    // const folder = await prisma.folder.findUnique({
    //     where: { id: folderId },
    //     include: {
    //         subfolders: true,
    //         files: true,
    //     }
    // });

    // if (!folder) {
    //     return res.status(404).send("Folder not found");
    // }

    // res.render("pages/index", { folders: folder.subfolders, files: folder.files });
    const userId = req.user.id;
    const folderId = parseInt(req.params.id);

    try {
        const folder = await prisma.folder.findUnique({
            where: { id: folderId,
                
                userId
             },
            include: {
                subfolders: true,
                files: true,
                parent: true,
            }
        });

        if (!folder) {
            return res.status(404).render('error', { message: "Folder not found" });
        }

        let breadcrumbTrail = [];
        let currentFolder = folder;

        while (currentFolder) {
            breadcrumbTrail.unshift({
                name: currentFolder.name,
                id: currentFolder.id,
            });
            currentFolder = currentFolder.parent; // Move to the parent folder
        }

        console.log(breadcrumbTrail);

        res.render('pages/folders', {
            breadcrumbTrail,
            folder,         
            subfolders: folder.subfolders,
            files: folder.files,
            title: folder.name || 'Folder View',
            folderId: folder.id,
        });
    } catch (error) {
        console.error("Error fetching folder:", error);
        res.status(500).render('error', { message: "Server error while fetching folder contents." });
    }


};

// Tackle the foll later:

const getFolderByPath = async (req, res) => {
    const { path } = req.params;
    const pathSegments = path.split("/");

    try {
        let currentParent = null;
        let folder = null;
        const folderHierarchy = [];

        for (let segment of pathSegments) {
            folder = await prisma.folder.findFirst({
                where: {
                    name: segment,
                    parentId: currentParent,
                },
            });

            if (!folder) {
                return res.status(404).json({ error: `Folder ${segment} not found` });
            }

            folderHierarchy.push(folder);
            currentParent = folder.id;
        }

        const folderDetails = await prisma.folder.findUnique({
            where: { id: folder.id },
            include: {
                subfolders: true,
                files: true,
            },
        });

        // res.render("pages/folder", {
        //     folder: folderDetails,
        //     folderHierarchy: folderHierarchy,
        //     subfolders: folderDetails.subfolders,
        //     files: folderDetails.files,
        //     title: folderDetails.name || 'Folder View',
        // });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error retrieving folder" });
    }
};


const updateFolder = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user.id;

    try {
        const updatedFolder = await prisma.folder.updateMany({
            where: { id: Number(id), userId },
            data: { name },
        });
        if (updatedFolder.count === 0) {
            return res.status(404).json({ error: "Folder not found or access denied" });
        }
        res.status(200).json({ message: "Folder updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error updating folder" });
    }
};

const deleteFolder = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const deleteFolderRecursive = async (folderId) => {
        const files = await prisma.file.findMany({
            where: { folderId, userId },
        });

        await Promise.all(
            files.map(async (file) => {
                if (file.cloudinaryPublicId) {
                    await cloudinary.uploader.destroy(file.cloudinaryPublicId);
                }
            })
        );
        await prisma.file.deleteMany({
            where: { folderId, userId },
        });

        const subfolders = await prisma.folder.findMany({
            where: { parentId: folderId, userId },
        });

        await Promise.all(subfolders.map(subfolder => deleteFolderRecursive(subfolder.id)));

        await prisma.folder.delete({
            where: { id: folderId },
        });
    };

    try {
        await deleteFolderRecursive(Number(id));

        res.status(200).json({ message: "Folder and all associated subfolders and files deleted successfully" });
    } catch (error) {
        console.error("Error deleting folder:", error);
        res.status(500).json({ error: "Error deleting folder and its contents" });
    }
};


module.exports = {
    createFolder,
    getFolders,
    getFolderById,
    getFolderByPath,
    updateFolder,
    deleteFolder,
};
