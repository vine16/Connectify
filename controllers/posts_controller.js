const Post = require('../models/post');
const Comment = require('../models/comment');


module.exports.createPost = async function(req, res)
{
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        //if req is type of ajax
        if(req.xhr){
            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
            //from user just populate the name field
            try
            {
                post = await post.populate('user', 'name');
            }
            catch(err)
            {
                console.log(err, 'post not populated');
            }
            return res.status(200).json({
                
                data:{
                    post: post
                }, 
                message:'Post Created'
            });
        }
        req.flash('success', 'Post Successfully Created!');
        return res.redirect('back');
    }
    catch(err)
    {
        req.flash('error', err);
        return res.redirect('back');
    }
}

module.exports.destroy = async function(req, res)
{
    try{
        let post = await Post.findById(req.params.id); 
        //.id mean converting the objectId into string type, by passport-js
        
        //check if user is allowed to delete this post
        if(post.user == req.user.id)
        {
            await post.deleteOne();

            //delete all comments where id = post which is deleted by user
            await Comment.deleteMany({post: req.params.id});
            
            if(req.xhr)
            {
                console.log('xhr req', req.params.id);

                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                })
            }
            req.flash('success', "Post and associated comments deleted");
            return res.redirect('back');
        }
        else
        {
            req.flash('error', 'you cannot delete this post');
            console.log('no such post exists in database');
        }
    }
    catch(err)
    {
        req.flash('error', err);
        return res.redirect('back');
    }
}