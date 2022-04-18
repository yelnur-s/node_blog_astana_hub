const express = require("express");
const mongoose = require('mongoose');
const fs = require("fs");
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const logger = require("morgan");
const GoogleStrategy = require("passport-google-oauth20")
const MongooseStore = require('mongoose-express-session')();
const mongooseStore = new MongooseStore({
    mongoose: mongoose,
    store: require('express-session').Store
});


mongoose.connect('mongodb://localhost:27017/astana_hub').then(() => {
    console.log("Connected to MongoDB");
}).catch(() => {
    console.log("Failed to connect to MongoDB");
});

const Blog = require("./server/blog/Blog");
const User = require("./server/user/User");

passport.use(new GoogleStrategy({
    clientID: "9472403709-ki941ceh1rb4re90ujt6l9us13a4nj02.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: 'http://localhost:3000/api/auth/google',
    scope: ['openid', 'profile', 'email'],
    state: true
  },
  async function(accessToken, refreshToken, profile, cb) {
    let user = await User.findOne({google_id: profile.id}).exec();
    if(!user) {
        try {
            user = await new User({
                email: profile.emails[0].value,
                full_name: profile.displayName,
                nickname: profile.emails[0].value,
                avatar: profile.photos[0].value,
                google_id: profile.id
            }).save();
        } catch (err){
            cb(err, null)
        }
    }
    cb(null, user)
  }
));

passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    function(email, password, done) {
      User.findOne({ email }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        user.verifyPassword(password, (err, isMatch) => {
            if(err) return done(err); 
            if(!isMatch) return done(null, false); 
            return done(null, user);
        })
      });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});



const app = express();

// app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded());
app.use(express.json());
app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, rolling: false, saveUninitialized: true, store: mongooseStore }));
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

app.use(require('./server/pages'))
app.use(require('./server/blog/routes'))


function registrationValidator(req, res, next) {
    let {
        full_name,
        email,
        nickname,
        password,
        password2
    } = req.body;
    if(!full_name || full_name.length < 2) return res.redirect("/register?error=1")
    if(!email || email.length < 2) return res.redirect("/register?error=2")
    if(!nickname || nickname.length < 2) return res.redirect("/register?error=3")
    if(!password || password.length < 3) return res.redirect("/register?error=4")
    if(password != password2) return res.redirect("/register?error=5")

    next();
}


app.post("/api/auth/signup", registrationValidator, (req, res, next) => {
    new User({
        email: req.body.email,
        full_name: req.body.full_name,
        nickname: req.body.nickname,
        password: req.body.password
    }).save((err, user) => {
        if(err) return next(err);

        res.redirect("/login");
    });

   
})

app.post('/api/auth/signin', 
  passport.authenticate('local', { failureRedirect: '/login?error=1' }),
  function(req, res) {
    res.redirect('/profile/' + req.user.nickname);
  });

  app.get('/api/auth/signout', (req, res) => {
    req.logout();
    res.redirect('/');
  });


  app.get('/api/auth/google/signin',
  passport.authenticate('google'));

  app.get('/api/auth/google', 
  passport.authenticate('google', { failureRedirect: '/login?error=2' }),
  function(req, res) {
    // Successful authentication, redirect home.

    res.redirect('/profile/' + req.user.nickname);
  });


app.listen(3000, () => console.log("Server is listening on port 3000"));


// const Blog = require("./models/Blog");

// new Blog({
//     title: "Second blog",
//     description: "Second desc"
// }).save();

// 9472403709-ki941ceh1rb4re90ujt6l9us13a4nj02.apps.googleusercontent.com    ClientID
// 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                                       Secret