const { Router } = require("express");
const fileController = require("../controllers/fileController");

const fileRouter = Router();

router.get("/:id", fileController.getFileDetails);
router.get("/:id/download", fileController.downloadFile);

module.exports = fileRouter;
