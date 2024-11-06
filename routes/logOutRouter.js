const { Router } = require("express");
const logOutController = require("../controllers/logOutControllers");

const logOutRouter = Router();

logOutRouter.get("/", logOutController.logOut);

module.exports = logOutRouter;
