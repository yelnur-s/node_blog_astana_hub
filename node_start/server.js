const express = require("express");
const moment = require('moment');
// const logger = require("morgan");
const passport = require("passport");
require('./server/config/db');
require('./server/config/passport');
const lnJSON = require('./server/config/language/index.json')

const {mongooseStore} = require('./server/config/session')

const app = express();

// app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded());
app.use(express.json());
app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, rolling: false, saveUninitialized: true, store: mongooseStore }));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.moment = moment;
    res.locals.ln = "ru";
    res.locals.lnJSON = lnJSON;
    let urlpath = req.url;

    // "/login".split("/");
    // ["", "login"]
    // "/kz/login"
    // ["", "kz", "login"]
    let dash = req.url.split("/");
    if(dash.length >= 2) {
        let code = dash[1];
        if(code !== '' && lnJSON.hasOwnProperty(code)) {
            res.locals.ln = code;
            dash.shift()
            dash.shift()
            urlpath = "/" + dash.join('/')
        }
    } 

    res.locals.toRu = urlpath
    res.locals.toEn = "/en" +  urlpath
    res.locals.toKz = "/kz" +  urlpath

    next();
})


app.set("view engine", "ejs");
app.use(require('./server/pages'))
app.use(require('./server/blog/routes'))
app.use(require('./server/auth/routes'))
app.use(require('./server/category/routes'))
app.use(require('./server/comment/routes'))
app.use(require('./server/tag/routes'))

app.listen(3000, () => console.log("Server is listening on port 3000"));
