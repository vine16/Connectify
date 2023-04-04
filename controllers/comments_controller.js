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

module.exports.destroy = async function(req, res)
{
    let comment;
    try
    {
        comment = await Comment.findById(req.params.id);
    }
    catch(err)
    {
        console.log('error in finding the comment');    
    }

    //find post of that comment
    const postId = comment.post;

    try
    {
        //this will give us an array
        // postOfComment = await Post.find({_id : postId});
        postOfComment = await Post.findOne({_id : postId});   
    }
    catch(err)
    {
        console.log(err,' err in finding the post of the comment');
    }
    //check if the user is allowed to delete that comment
    //1. the user who is signed in, should be the user who made the comment
    //2. the post of the comment belongs to the user who is signed in


    // console.log(postOfComment[0].user, req.user.id);
    // console.log(postOfComment.user, req.user.id);

    if(req.user.id == comment.user || postOfComment.user == req.user.id)
    {
        //extract postId before deleting the comment
        
        try
        {
            await comment.deleteOne();
        }
        catch(err)
        {
            console.log(err, 'error in deleting the comment');
        }

        try
        {
            //updateOne -> update a single doc in mongodb collection
            await Post.updateOne(
                    { _id: postId },
                    {$pull: { comments: comment.id }} 
            );
        }
        catch(err)
        {
            console.log(err, 'error in deleting comment id from posts.comment array');
        }
    }
    else
    {
        console.log("this comment doesn't belong to the user trying to delete");
    }
    return res.redirect('back');
}