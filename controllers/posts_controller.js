const Post = require('../models/post');
const Comment = require('../models/comment');


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

module.exports.destroy = async function(req, res)
{
    let post;
    try{
        post = await Post.findById(req.params.id);
    }
    catch(err)
    {
        console.log(err, 'error in finding the post you want to delete');
    }

    //.id mean converting the objectId into string type, by passport-js
    //check if user is allowed to delete this post
    if(post.user == req.user.id)
    {
        try
        {
            await post.deleteOne();
        }
        catch(err)
        {
            console.log(err, 'error in deleting post');
        }

        try
        {
            //delete all comments where id = post which is deleted by user
            await Comment.deleteMany({post: req.params.id});
        
        }
        catch(err)
        {
            console.log(err, 'error in deleting comments of post');
        }
        return res.redirect('back');
    }
    else
    {
        console.log('no such post exists in database');
        return res.redirect('back');
    }
    
}