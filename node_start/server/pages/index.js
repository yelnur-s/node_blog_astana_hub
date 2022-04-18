const express = require("express");
const router = express.Router();
const {isAuth} = require('../auth/middlewares')
const User = require('../user/User')
const Blog = require('../blog/Blog')

router.get('/', async (req, res) => {
    const blogs = await Blog.find().populate('author', 'nickname').exec(); 
    res.render("index.ejs", {
        currentUser: req.user,
        blogs: blogs
    });
})


router.get('/profile/:nickname', async (req, res) => {

    const author = await User.findOne({nickname: req.params.nickname}).exec(); 
    if(!author) return res.status(404).send("Not Found");
    const blogs = await Blog.find({author: author._id}).exec();
    res.render("profile.ejs", {
        blogs,
        currentUser: req.user,
        nickname: req.params.nickname
    }); 
})


router.get('/newblog',isAuth,  (req, res) => {
    res.render("newblog.ejs", {
        currentUser: req.user
    })
})

router.get('/login', (req, res) => {
    if(req.user) return res.redirect('/profile/'+req.user.nickname)
    res.render("login.ejs");
})

router.get('/register', (req, res) => {
    if(req.user) return res.redirect('/profile/'+req.user.nickname)
    res.render("register.ejs");
})

router.get('/editblog', isAuth,  async (req, res) => {
    const blog = await Blog.findById(req.query.id).exec();

    res.render("editblog.ejs", {
        blog,
        currentUser: req.user
    });
})




module.exports = router;