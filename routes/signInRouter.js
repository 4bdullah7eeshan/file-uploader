const { Router } = require("express");
const passport = require("passport");

const signInController = require("../controllers/signInControllers");

const signInRouter = Router();

signInRouter.get("/", signInController.getSignInPage);
signInRouter.post("/", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/sign-in",
    failureFlash: true,
}));


module.exports = signInRouter;