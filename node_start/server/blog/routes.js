const express = require("express");
const multer  = require('multer')
const router = express.Router();

const {isAuth} = require('../auth/middlewares')
const {isBlogAuthor} = require('./middlewares')
const {createBlog, deleteBlog} = require('./controller');

const User = require('../user/User')
const Blog = require('./Blog')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        
      cb(null, './public/images/blogs')
    },
    filename: function (req, file, cb) {
       const filename = file.originalname;
       let fileExt = filename.split(".")
       fileExt = fileExt[fileExt.length - 1];
    
      const uniqueSuffix = Date.now() + '.' + fileExt; 
      cb(null, uniqueSuffix)
    }
  })

const upload = multer({storage})




router.post("/api/blogs", isAuth, upload.single('image'), createBlog);

router.delete("/api/blogs/:id", isAuth, isBlogAuthor, deleteBlog);

router.get("/api/blogs/profile/:nickname", async (req, res) => {
    const author = await User.findOne({nickname: req.params.nickname}).exec(); 
    if(!author) return res.status(404).send("Not Found");
    const blogs = await Blog.find({author: author._id}).exec();
    res.status(200).send(blogs);
})

router.put("/api/blogs/:id", isAuth, isBlogAuthor, upload.single('image'), async (req, res) => {
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

        await blog.save();


    } else {
        await Blog.updateOne({_id: req.body._id}, {
            $set: {
                title: req.body.title, 
                description: req.body.description}
            }
        )
    }

   
    
    res.status(200).end();
})




module.exports = router;