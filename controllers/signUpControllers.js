const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getSignUpPage = asyncHandler(async (req, res) => {
    res.render("pages/signUp", { title: "Sign up", user: req.user });
});

const validateSignUp = [
    body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
    body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'),
    body('username').trim().isLength({ min: 1 }).withMessage('Username is required')
        .custom(async (value) => {
            const user = await prisma.user.findUnique({ where: { username: value } });
            if (user) {
                throw new Error('Username already in use');
            }
            return true;
        }),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    })
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render("pages/signUp", {
            title: "Sign up",
            errors: errors.array(),
            userData: req.body,
        });
    }
    next();
};

const createNewUser = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                firstName,
                lastName,
                username,
                password: hashedPassword,
            },
        });

        res.redirect("/sign-in");
    } catch (err) {
        next(err);
    }
});

module.exports = {
    getSignUpPage,
    validateSignUp,
    handleValidationErrors,
    createNewUser,
};
