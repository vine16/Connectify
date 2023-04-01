// passport.authenticate -> inbuilt, used to verify user
//passprot.checkAuthenticated -> custom function, check if user is already authencticated or not
//route for user
const express = require('express');
// const { use } = require('passport');

const router = express.Router();
const passport = require('passport');
const usersController = require('../controllers/users_controller');

router.get('/profile', passport.checkAuthentication, usersController.profile);


router.get('/sign-up', usersController.signUp);

router.get('/sign-in', usersController.signIn);

router.post('/create', usersController.create);

router.get('/sign-out', usersController.destroySession);


router.post('/create-post', usersController.createPost);
//use passport as middleware to authenticate
//passport.authenticate -> abhi jo user aaya hai vo authenticated hai ya nhi
// If the authentication is successful, the passport.authenticate middleware calls the next()
//and the control will goes to usersContaoller middleware, else redirect to /users/sign-in 
//step1: will use the config defined in passport-local-startegy, using passport.use('local', defining field to be used for authentication)
router.post('/create-session', passport.authenticate(
    'local', //using local strategy
    {failureRedirect: '/users/sign-in'},//in case done(null, false);
) ,usersController.createSession); //in case of done(null, user);

module.exports  = router;