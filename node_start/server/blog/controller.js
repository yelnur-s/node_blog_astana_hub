const fs = require("fs");
const path = require("path");

const User = require('../user/User')
const Blog = require('./Blog')


const createBlog = async (req, res) => {  
    let imagePath;
    if(req.file) {
        imagePath = "/images/blogs/" + req.file.filename
    }
    console.log(req.body.tags)
    await new Blog({
        title: req.body.title,
        description: req.body.description,
        img: imagePath,
        author: req.user._id,
        category: req.body.category,
        tags: req.body.tags
    }).save();

    res.redirect('/profile/' + req.user.nickname);
}


const deleteBlog = async (req, res) => {
    const blog = await Blog.findById(req.params.id).exec();
    try {
        fs.unlinkSync(path.join(__dirname, "/public", blog.img))
    } catch (e) {
        console.log(e.message)
    } 

    await Blog.deleteOne({_id: req.params.id})
    res.status(200).end();
}

const getProfileBlogs = async (req, res) => {
    const author = await User.findOne({nickname: req.params.nickname}).exec(); 
    if(!author) return res.status(404).send("Not Found");
    const blogs = await Blog.find({author: author._id}).exec();
    res.status(200).send(blogs);
}

const updateBlog = async (req, res) => {
    let imagePath;
    if(req.file) {
        const blog = await Blog.findById(req.params.id).exec();
        try {
            fs.unlinkSync(path.join(__dirname, "/public", blog.img))
        } catch (e) {
            console.log(e.message)
        } 

        imagePath = "/images/blogs/" + req.file.filename;

        blog.title = req.body.title;
        blog.description = req.body.description;
        blog.img = imagePath;
        blog.category = req.body.category;
        blog.tags = req.body.tags

        await blog.save();


    } else {
        console.log(req.body)
        await Blog.updateOne({_id: req.body._id}, {
            $set: {
                title: req.body.title, 
                description: req.body.description,
                category: req.body.category,
                tags: req.body.tags,
            }
            }
        )
    }

   
    
    res.status(200).end();
}


module.exports = {
    createBlog,
    deleteBlog,
    getProfileBlogs,
    updateBlog
}