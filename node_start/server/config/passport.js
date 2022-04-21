const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20")

const User = require('../user/User')

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

