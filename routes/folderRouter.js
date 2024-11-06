const { Router } = require("express");
const folderController = require("../controllers/folderController");

const folderRouter = Router();

// Create a new folder
folderRouter.post("/", folderController.createFolder);

// Get all folders for the authenticated user
folderRouter.get("/", folderController.getFolders);

// Get a specific folder by ID
folderRouter.get("/:id", folderController.getFolderById);

// Update a folder by ID
folderRouter.put("/:id", folderController.updateFolder);

// Delete a folder by ID
folderRouter.delete("/:id", folderController.deleteFolder);

module.exports = folderRouter;