const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/users');

//authentication using passport
//STEP2
passport.use(new LocalStrategy({
    //as passport usese 'username' and 'possword' for authentication, here we are telling to 
    //use email as username, that will be provided by the user
    usernameField: 'email',
    passReqToCallback: true //set the first argument as req
    },
    
    //done -> inbuilt function reporting to passport.js
    //these arguments will be passed by the passport itself
    async function(req, email, password, done)
    {
        //find a user with this email and password and establish the identity
        try
        {
            const user = await User.findOne({email :email});
            if(!user || user.password != password)
            {
                req.flash('error', 'Invalid Username/Password');
                console.log('Invalid username | password');
                return done(null, false);//no error but user is not found
            }

            return done(null, user);//no error and authentication successfull
        }
        catch(error)   
        {
            req.flash('error', error);
            console.log('error in finding user -> passport');
            return done(err);//report an error to passport
        }
    }
));


//once the autheriziation is successfull
//which user? passed into done() after successfull authentication
//serializing the user to decide which key is to be kept in the cookies of users browser
//which is encrypted using the express-session library
passport.serializeUser(function(user, done)
{
    done(null, user.id);
})

//find if user exists with this id
//deserializing the user from the key in the cookies
// Passport.js deserializes the user object from the session and attaches it to the req.user property
passport.deserializeUser(async function(id, done){
    
    try
    {
        let user = await User.findById(id);

        //once the user is found with this id
        return done(null, user);
    }
    catch(err)
    {
        console.log('error in finding user');
        done(err);
    }

});

//check if user is authenticated
passport.checkAuthentication = function(req, res, next)
{
    
    //if the user signed in, then pass on the request to the next function(controller's action)
    if(req.isAuthenticated()){
        return next();
    }

    console.log('user is not signed in');
    //if user is not signed in 
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next)
{
    if(req.isAuthenticated())
    {
        //req.user contains the current signed in user from the session cookie and we are just sending this to the
        //locals for the views
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport; 