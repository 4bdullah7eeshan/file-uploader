const { Router } = require("express");
const signUpController = require("../controllers/signUpControllers");

const signUpRouter = Router();

signUpRouter.get("/", signUpController.getSignUpPage);
signUpRouter.post(
    "/", 
    signUpController.validateSignUp,
    signUpController.handleValidationErrors,
    signUpController.createNewUser,
);

module.exports = signUpRouter;