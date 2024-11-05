const { Router } = require("express");
const uploadController = require("../controllers/uploadControllers");

const uploadRouter = Router();

uploadRouter.get("/", uploadController.getUploadPage);
uploadRouter.post("/");

module.exports = uploadRouter;
