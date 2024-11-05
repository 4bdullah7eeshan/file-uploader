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
const signInRouter = require("./routes/signInRouter");

const app = express();
const assetsPath = path.join(__dirname, "public");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());

app.use(methodOverride("_method"));
app.use(bodyParser.json());

app.use(express.static(assetsPath));

app.use(express.urlencoded({ extended: true }));

app.use(flash());

app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// Use routers here
app.use("/", indexRouter);
app.use("/sign-in", signInRouter);


passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
          const user = await prisma.user.findUnique({ where: { username } });
          if (!user) return done(null, false, { message: 'User not found' });
    
          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) return done(null, false, { message: 'Incorrect password' });
    
          return done(null, user);
        } catch (error) {
          return done(error);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});
  
passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      done(null, user);
    } catch (error) {
      done(error);
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`File Uploader running on port ${PORT}!`)
);
