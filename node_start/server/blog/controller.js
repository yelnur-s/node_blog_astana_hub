const User = require('../user/User')
const Blog = require('./Blog')

const createBlog = async (req, res) => {  
    let imagePath;
    if(req.file) {
        imagePath = "/images/blogs/" + req.file.filename
    }

    await new Blog({
        title: req.body.title,
        description: req.body.description,
        img: imagePath,
        author: req.user._id
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


module.exports = {
    createBlog,
    deleteBlog
}