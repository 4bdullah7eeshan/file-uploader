const express = require("express");
const path = require("node:path");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const { PrismaClient } = require('@prisma/client')

// Import routers here
const indexRouter = require("./routes/indexRouter");
