require('dotenv').config()
const express = require('express');
const session = require("express-session");
const cors = require("cors")
const passport = require('passport');
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sequelize = require('./config/db');

require('./config/passport');
require('./config/sync');

const userAuthRouter = require('./routers/userAuthRouter');
const questionRouter = require('./routers/questionRouter');
const userControlRouter = require('./routers/userControlRouter');
const tagRouter = require('./routers/tagRouter');

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

const corsOptions = {
    /*origin can't be wildcard ('*') when sending credentials*/
    origin: [process.env.REACT_APP_FRONTEND,process.env.REACT_APP_BACKEND,"http://localhost:3000","http://localhost:8000"],
    optionsSuccessStatus: 200, // some legacy borwsers choke on 204 (IE11 & various SmartTVs)
    /* 
        Below sets Access-Control-Allow-Credentials to true for cross origin credentials sharing.
        In this case it is used to get cookies, for express-session.
    */
    credentials: true,
};

app.use(cors(corsOptions));
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use('/auth', userAuthRouter);
app.use('/question', questionRouter);
app.use('/user', userControlRouter);
app.use('/tag', tagRouter);


const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
})