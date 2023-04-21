const Post = require('../models/post');
const User = require('../models/users');

module.exports.home =  async function(req, res){
    // res.end('<h1>Welcome to home</h1>');
    //cooking coming with request and going back with the response
    // res.cookie('user_id', 299);
    try{
        // posts = await Post.find();
        // users = await User.find();
        let posts = await Post.find({})
        .sort({createdAt: -1})
        .populate('user')
        .populate({
            path: 'comments',
            populate:[
                {path: 'user'},
                {path: 'post'}
        ]
        });
        // posts =  await Post.find({}).populate('user').exec();

        let users = await User.find({});

        return res.render('home', {
            title: "home",
            posts: posts,
            all_users: users
        });
    }
    catch(err)
    {
        console.log(err, 'error in getting posts from database');
    }
}
