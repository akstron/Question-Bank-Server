require('dotenv').config()
const express = require('express');
const session = require("express-session");
const passport = require('passport');
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sequelize = require('./config/db');

require('./config/passport');
const userAuthRouter = require('./routers/userAuthRouter');

const app = express();

const sessionStore = new SequelizeStore({
    db: sequelize,
});

sessionStore.sync();

/* Session configuration */
const sessionOptions = {
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true, 
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      /* Set to false, to allow cookies from http */
      secure: false,
    }
}

app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(userAuthRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
})