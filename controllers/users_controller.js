const User = require('../models/users');
const fs = require('fs');
const path = require('path')

//browser -> router -> controller
module.exports.profile = async function(req, res)
{
    try                                                 
    {
        let user = await User.findById(req.params.id);
        return res.render('user_profile',
        {
            title: 'User Profile',
            profile_user: user
        });
    }
    catch(err)
    {
        console.log(err, 'cannot find user');
        return;
    }
    
}

module.exports.update = async function(req, res)
{
    //signedIn user == id of profile user trying to update
    if(req.user.id == req.params.id)
    {
        //User.findByIdAndUpdate(req.params.id, {name: req.body.name, email: req.body.email});
        try
        {
            // await User.findByIdAndUpdate(req.params.id, req.body);
            let user = await User.findById(req.params.id);
            //mutler is used to work with file which is in binary form
            User.uploadedAvatar(req, res, function(err){
                if(err){
                    console.log('****Multer Error', err);
                }
                console.log(req.file, 'req.file');
                user.name = req.body.name;
                user.email = req.body.email;
                if(req.file){ //as file is not set as 'required' in form
                    if(user.avatar)
                    {
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }
                    //this is saving the path of the uploaded into the avatar filed in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                req.flash('success', 'Profile Updated Successfully!');
                return res.redirect('back');
            })
        }
        catch(err)
        {
            console.log(err, 'error in updating info');
        }
        //we set into req bec they need to be available in the next request's response
        //doing this will add the msg to session by connect-flash
        //and in next request will be retrieved by connect-flash and again will be added to req object
        
        // return res.redirect('back');
    }
    else //someone fiddling with our website
    {
        req.flash('error', err);
        return res.status(401).send('Unauthorized');
    }
}


//render the sign up page,(not sign up the user, just render that page)
module.exports.signUp = function(req, res)
{
    if(req.isAuthenticated())
    {
        return res.redirect('/');
    }
    return res.render('user_sign_up',{
        'title': 'connectify | sign up'
    })
}


//render the sign in page
module.exports.signIn = function(req, res)
{
    if(req.isAuthenticated())
    {
        return res.redirect('/');
    }
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


    try{
        let user = await User.findOne({email : req.body.email});

        //if user is not already present
        //create user
        if(!user)
        {   
            await User.create(req.body);
            req.flash('success', 'Signedup Successfully!');
            return res.redirect('/users/sign-in');
        }
        req.flash('error', 'User already exits, Please Sign In');
        console.log("user already present, Please Sign In");
        return res.redirect('/users/sign-in'); 
    }
    catch(err)
    {
        req.flash('error', err);
        console.log('error in finding user in signing up');
    }
}


//check at router if the user is signed in and then redirect to home page
module.exports.createSession = function(req, res)
{
    //type, msg
    //this msg is on req, we need to pass it to response
    req.flash('success', 'Logged In Successfully')
    return res.redirect('/');
}


module.exports.destroySession = function(req, res)
{
    // Removing the user’s session cookie to remove the identity 
    //provided by passport
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('error', 'You have Logged Out');
        //to send it to res, we can use locals or using middleware
        res.redirect('/');
    });
}