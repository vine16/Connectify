const Post = require('../../../models/post')
const Comment = require('../../../models/comment');
module.exports.index = async function(req, res){

    let posts = await Post.find({})
    .sort({createdAt: -1})
    .populate('user', 'name email')
    .populate({
        path: 'comments',
        populate:[
            {path: 'user'},
            {path: 'post'}
    ]
    });

    return res.status(200).json({
        message: 'list of posts',
        posts: posts
    })
}


module.exports.destroy = async function(req, res)
{
    try{
        let post = await Post.findById(req.params.id); 
        //.id mean converting the objectId into string type, by passport-js
        
        //check if user is allowed to delete this post
        // if(post.user == req.user.id)
        // {
            await post.deleteOne();

            //delete all comments where id = post which is deleted by user
            await Comment.deleteMany({post: req.params.id});
            
            // if(req.xhr)
            // {
            //     console.log('xhr req', req.params.id);

            //     return res.status(200).json({
            //         data: {
            //             post_id: req.params.id
            //         },
            //         message: "Post deleted"
            //     })
            // }
            // req.flash('success', "Post and associated comments deleted");
            return res.status(200).json({
                message: "post and its comments deleted successfully"
            })
        // }
        // else
        // {
        //     req.flash('error', 'you cannot delete this post');
        //     console.log('no such post exists in database');
        // }
    }
    catch(err)
    {
        // req.flash('error', err);
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
}