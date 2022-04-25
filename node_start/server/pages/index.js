const express = require("express");
const router = express.Router();
const {isAuth} = require('../auth/middlewares')
const User = require('../user/User')
const Blog = require('../blog/Blog')
const Tag = require('../tag/Tag')
const Category = require('../category/Category')
const {getCategories} = require('../category/resources');
const {getTags} = require('../tag/resources');

router.get('/', async (req, res) => {
    let options = {};

    const category = await Category.findOne({slug: req.query.category}).exec();
    if(category) {
        options.category = category._id
        res.locals.category = category.slug
    }


    let page = 0;
    const limit = 3;
    if(req.query.page && typeof (req.query.page * 1) === 'number' && req.query.page * 1 >= 0) {
        page = req.query.page * 1;
        res.locals.page = page
    }

    if(req.query.q) {
        options.$or = [{title: new RegExp(req.query.q, 'i')},{description: new RegExp(req.query.q, 'i')}]
        res.locals.q = req.query.q
    }

    const blogs = await Blog
    .find(options)
    .limit(limit)
    .skip(limit * page)
    .populate('author', 'nickname').populate('category', 'name').exec(); 
    
    const totalBlogs = await Blog.count(options).exec();

    const categories = await getCategories();

    res.render("index.ejs", {
        currentUser: req.user,
        blogs,
        categories,
        totalBlogs,
        pages: Math.ceil(totalBlogs/limit),
        currentPage: page
    });
})


router.get('/profile/:nickname', async (req, res) => {

    const author = await User.findOne({nickname: req.params.nickname}).exec(); 
    if(!author) return res.status(404).send("Not Found");
    const blogs = await Blog.find({author: author._id}).populate('category', 'name').exec();
    res.render("profile.ejs", {
        blogs,
        currentUser: req.user,
        nickname: req.params.nickname
    }); 
})

router.get('/details/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    .populate('category', 'name')
    .populate('author', 'nickname')
    .populate('tags')
    .exec();
    const categories = await getCategories();

    console.log(blog);

    res.render("blog-details.ejs", {
        blog,
        categories,
        currentUser: req.user,
    })
});


router.get('/newblog',isAuth,  async (req, res) => {
    const categories = await getCategories();
    const tags = await getTags();
    res.render("newblog.ejs", {
        currentUser: req.user,
        categories,
        tags
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
    const categories = await getCategories();
    const tags = await getTags();
    res.render("editblog.ejs", {
        blog,
        currentUser: req.user,
        categories,
        tags
    });
})




module.exports = router;