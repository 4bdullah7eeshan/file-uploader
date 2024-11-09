const { Router } = require("express");
const folderController = require("../controllers/folderControllers");

const folderRouter = Router();

// Create a new folder
folderRouter.post("/", folderController.createFolder);

// Get all folders for the authenticated user
folderRouter.get("/", folderController.getFolders);

// Get a specific folder by ID
folderRouter.get("/:id", folderController.getFolderById);

//folderRouter.get("/:path*", folderController.getFolderByPath);


// Update a folder by ID
folderRouter.put("/:id", folderController.updateFolder);

// Delete a folder by ID
folderRouter.delete("/:id", folderController.deleteFolder);

module.exports = folderRouter;
