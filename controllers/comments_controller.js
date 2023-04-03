const Comment = require('../models/comment');
const Post = require('../models/post');


module.exports.create = async function(req, res){

    //create comment if the post with that id exist in the database
    //else user may manipulate the id passed by the comment form
    let post;
    try
    {
        post = await Post.findById(req.body.post);
    }
    catch(err)
    {
        console.log(err,'no such post exist');
    }
    if(post){
        let comment;
        try{
            comment = await Comment.create({
                content: req.body.content,
                post: req.body.post, //or post._id
                user: req.user._id
            })
        }
        catch(err)
        {
            console.log(err, 'error in creating comment');
        }   

        post.comments.push(comment);
        post.save();

        res.redirect('/');
    }
    
}