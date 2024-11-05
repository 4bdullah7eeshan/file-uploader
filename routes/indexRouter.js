const { Router } = require("express");
const indexController = require("../controllers/indexControllers");

const indexRouter = Router();

indexRouter.get("/", indexController.getHomePage);

module.exports = indexRouter;