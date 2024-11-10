const { Router } = require("express");
const fileControllers = require("../controllers/fileControllers");

const fileRouter = Router();

fileRouter.get("/:id", fileControllers.getFileDetails);
fileRouter.get("/:id/download", fileControllers.downloadFile);
fileRouter.delete("/:id", fileControllers.deleteFile);



module.exports = fileRouter;
