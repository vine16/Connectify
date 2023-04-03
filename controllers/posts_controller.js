const Post = require('../models/post');

module.exports.createPost = async function(req, res)
{
    try{
        await Post.create({
            content: req.body.content,
            user: req.user._id
        });
    }
    catch(err)
    {
        console.log(err, 'error in creating a post');
    }

    return res.redirect('back');
}