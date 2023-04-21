const Comment = require('../models/comment');
const Post = require('../models/post');


module.exports.create = async function(req, res){
    //create comment if the post with that id exist in the database
    //else user may manipulate the id passed by the comment form
    try
    {
        let post = await Post.findById(req.body.post);
        if(post){
            let comment;
            comment = await Comment.create({
                content: req.body.content,
                post: req.body.post, //or post._id
                user: req.user._id
            })
            post.comments.push(comment);
            post.save();
            if(req.xhr)
            {
                try
                {
                    comment = await comment.populate('user','name');
                }
                catch(err)
                {
                    console.log(err, 'error in populating comment with username');
                }
                return res.status(200).json({
                    data:{
                        comment: comment,
                        postId : post.id
                    },
                    message: 'comment created successfully'
                })
            }
        }
        res.redirect('/');
    }
    catch(err)
    {
        console.log(err,'no such post exist');
        return;
    }
}


module.exports.destroy = async function(req, res)
{
    try
    {
        let comment = await Comment.findById(req.params.id);
        
        //extract postId before deleting the comment
        const postId = comment.post;
        //find post of that comment
        //this will give us an array
        // postOfComment = await Post.find({_id : postId});

        let postOfComment = await Post.findOne({_id : postId}); 

        //check if the user is allowed to delete that comment
        //1. the user who is signed in, should be the user who made the comment
        //2. the post of the comment belongs to the user who is signed in
        if(req.user.id == comment.user || postOfComment.user == req.user.id)
        {
            await comment.deleteOne();
            //updateOne -> update a single doc in mongodb collection
            await Post.updateOne(
                    { _id: postId },
                    {$pull: { comments: comment.id }} 
            );

            if(req.xhr)
            {
                res.status(200).json({
                    data:{
                        commentId: comment.id
                    },
                    message: 'comment deleted successfully'
                });
            }
        }
        else
        {
            console.log("this comment doesn't belong to the user trying to delete");
        }
        return res.redirect('back');
    }
    catch(err)
    {
        console.log(err, 'error');
        return;
    }
}
