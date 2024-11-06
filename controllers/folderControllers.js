const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createFolder = async (req, res) => {
    const { name } = req.body;
    const userId = req.user.id;
    
    try {
        const folder = await prisma.folder.create({
            data: {
                name,
                userId,
            },
        });
        res.status(201).json(folder);
    } catch (error) {
        res.status(500).json({ error: "Error creating folder" });
    }
};

const getFolders = async (req, res) => {
    const userId = req.user.id;

    try {
        const folders = await prisma.folder.findMany({
            where: { userId },
            include: { files: true },
        });
        res.status(200).json(folders);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving folders" });
    }
};

const getFolderById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const folder = await prisma.folder.findFirst({
            where: { id: Number(id), userId },
            include: { files: true },
        });
        if (!folder) {
            return res.status(404).json({ error: "Folder not found" });
        }
        res.status(200).json(folder);
    } catch (error) {
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

    try {
        await prisma.file.deleteMany({
            where: { folderId: Number(id), userId },
        });
        
        const deletedFolder = await prisma.folder.deleteMany({
            where: { id: Number(id), userId },
        });

        if (deletedFolder.count === 0) {
            return res.status(404).json({ error: "Folder not found or access denied" });
        }
        
        res.status(200).json({ message: "Folder and associated files deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting folder" });
    }
};


module.exports = {
    createFolder,
    getFolders,
    getFolderById,
    updateFolder,
    deleteFolder,
};
