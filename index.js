const express = require('express');
// taking the cookie header from the request, parsing the cookie values, and adding them as an object to the req object under req.cookies.
const cookieParser = require('cookie-parser');

const app = express();
const port = 2000;
const expressLayouts = require('express-ejs-layouts')//to render views that use layouts.

const db = require('./config/mongoose');

//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-startegy'); //configures local strategy for passport.js to use
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const customMdwr = require('./config/middleware');

app.use(express.urlencoded({extended:true}));

app.use(cookieParser())

//tell layout before the routes
//for all routes
app.use(expressLayouts)

//extract style and scripts from sub pages into the  the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(express.static('./assets'));


//make the uploads path available to browser
//server them as static files
app.use('/uploads', express.static(__dirname + '/uploads'));


//setting up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');


//if not specified, will by defualt for the layout file inside the views -> layouts -> layout.ejs
// app.set('layout', 'dhakka');

//●saveUninitialized: whenever there is a request that is not initialized { when the user
    // has not logged in }, we don’t need to store extra data in the session cookies.
//● Resave: When the identity is established we don’t have to rewrite or save the data if
    // it is not changed.
app.use(session({
    name: 'connectify',//name of cookie(default: connect.sid)
    //TODO change the secret before deployment in production mode
    secret: 'somerandomstring', //used to encrpt and decrypt the cookie
    saveUninitialized: false,
    resave: false, 
    cookie:{ //configure various properties of the session cookie
        maxAge: (1000 * 60 * 100)
    },
    //mongo store is used to store the session cookie in the db
    store: MongoStore.create({mongoUrl: 'mongodb://127.0.0.1:27017/connectify_development'})
}));

app.use(passport.initialize());//initializes the Passport authentication system for an Express.js application.
app.use(passport.session());//deserialize the user's information from the session, making it available on the req.user object.


//setting the currently authenticated user on the req.user property, based on the data stored in the session. This allows the user information to be easily accessed in any subsequent middleware or route handler that needs it.
app.use(passport.setAuthenticatedUser);

//should be used after the session config
//flash msgs will be set inside the cookie which stores the session information
app.use(flash());

//once retrieved, they will get deleted from the session object
//so that we only see them once
app.use(customMdwr.setFlash);

//user express route
//will be use for each type of request at '/'
//requests starting with '/zero' will be handled by this router like '/zero/anything'
// app.use('/zero', require('./routes/index'));

app.use('/', require('./routes/index'));

app.get('/', function(req, res)
{
    res.send('hello world');
})




//if router don't handle this '/' request, the request will come here




//by default live server listens at port 80
app.listen(port, (err) =>{
    
    if(err)
    {
        console.log(`Error in running the server: ${err}`);
    }
    else{
        console.log(`server is running on port: ${port}`);
    }
}
)