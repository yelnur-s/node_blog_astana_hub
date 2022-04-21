const signUp = (req, res, next) => {
    new User({
        email: req.body.email,
        full_name: req.body.full_name,
        nickname: req.body.nickname,
        password: req.body.password
    }).save((err, user) => {
        if(err) return next(err);

        res.redirect("/login");
    });

   
}


const signInLocal = function(req, res) {
    res.redirect('/profile/' + req.user.nickname);
  }


const signOut = (req, res) => {
    req.logout();
    res.redirect('/');
  }

const googleCallback = function(req, res) {
    // Successful authentication, redirect home.

    res.redirect('/profile/' + req.user.nickname);
  }

module.exports = {
    signUp,
    signInLocal,
    signOut,
    googleCallback
}