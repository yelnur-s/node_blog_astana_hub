const {transporter} = require("../config/gmail");
const User = require("../user/User");
const path = require('path');
const Mailgen = require('mailgen');


// console.log(path.join(__dirname, "../", "/mail-templates/signup/index.html"))


const mailGenerator = new Mailgen({
  theme: {
      path: path.join(__dirname,"../", "/mail-templates/signup/index.html"),
      plaintextPath: path.join(__dirname, "../", "/mail-templates/signup/index.txt")
  },
  // Configure your product as usual (see examples above)
  product: {
      name: 'Decode Blog',
      link: 'http://locahost:3000/',
      logo: "",
  }
});




const signUp = async (req, res, next) => {

    


    new User({
        email: req.body.email,
        full_name: req.body.full_name,
        nickname: req.body.nickname,
        password: req.body.password
    }).save(async (err, user) => {
        if(err) return next(err);

        const email = {
          body: {
              name: req.body.full_name,
              intro: 'Welcome to Decode Blog! We\'re very excited to have you on board.',
              action: {
                  instructions: 'To get started with Decode Blog, please click here:',
                  button: {
                      color: '#22BC66', // Optional action button color
                      text: 'Login to Blog',
                      link: 'http://localhost:3000/login'
                  }
              },
              outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
          }
        };
        
        const emailBody = mailGenerator.generate(email)
        
        transporter.sendMail({
          from: '"Dimash Test" <test.dimash.decode@gmail.com>', // sender address
          to: req.body.email, // list of receivers
          subject: `Wellcame, ${req.body.full_name}"`, // Subject line
          html: emailBody, // html body
        });
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