const Blog = require('./Blog')
async function isBlogAuthor(req, res, next) {
    const blog = await Blog.findById(req.params.id).exec();
    if(req.user._id.toString() === blog.author.toString()) return next();
    res.status(403).end("Access Forbiden")
}

module.exports = {
    isBlogAuthor,
}
