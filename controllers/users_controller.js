const User = require('../models/users');

//browser -> router -> controller
module.exports.profile = function(req, res)
{
    return res.end('<h1>user profile </h1>');
}

module.exports.post = function(req, res)
{
    return res.end('this is suthri post by the khusbhoo');
}


module.exports.person = function(req, res)
{
    return res.render('user_profile',{
        'title' : 'user profile'
    })
}


//render the sign up page
module.exports.signUp = function(req, res)
{
    return res.render('user_sign_up',{
        'title': 'connectify | sign up'
    })
}


//render the sign in page
module.exports.signIn = function(req, res)
{
    return res.render('user_sign_in',{
        'title' : 'connectify | sign in'
    })
}


//get the sign up data
module.exports.create = async function(req, res)
{
    if(req.body.password != req.body.confirm_password)
    {
        return res.redirect('back');
    }     

    let user;
    try{
        user = await User.findOne({email : req.body.email});
    }
    catch(err)
    {
        console.log('error in finding user in signing up');
    }

    //if user is not already present
    //create user
    if(!user)
    {   
        try{
            await User.create(req.body);
            console.log(req.body);
        }
        catch(err)
        {
            console.log('error in creating user while singing up');
        }
        return res.redirect('/users/sign-in');

    }

    console.log(req.body);
    console.log("user already present, Please Sign In");
    return res.redirect('/users/sign-in');



    
}


//sign in and create a session for the user
module.exports.createSession = function(req, res)
{
    //TODO later
}
