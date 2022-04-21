const Comment = require('./Comment');

const getComments = async (req, res) => {
    const comments = await Comment.find({blog: req.params.blog_id}).populate('user', 'full_name').exec();
    res.status(200).send(comments);
}

const createComment = async (req, res) => {
    const comment = await new Comment({
        text: req.body.text,
        blog: req.body.blog_id,
        user: req.user._id
    }).save();

    res.status(200).send(comment);
}

const deleteComment = async (req, res) => {
    await Comment.deleteOne({_id: req.params.id}).exec();
    res.status(200).end();
}

module.exports = {
    getComments,
    createComment,
    deleteComment
}