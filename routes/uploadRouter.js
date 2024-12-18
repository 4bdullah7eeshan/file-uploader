const { Router } = require("express");
const uploadController = require("../controllers/uploadControllers");

const uploadRouter = Router();

uploadRouter.get("/", uploadController.getUploadPage);
uploadRouter.post("/", uploadController.upload.single("file"), uploadController.createFile);

module.exports = uploadRouter;
