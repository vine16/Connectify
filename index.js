
const express = require('express');

const cookieParser = require('cookie-parser');

const app = express();
const port = 2000;
const expressLayouts = require('express-ejs-layouts')

const db = require('./config/mongoose');
const { urlencoded } = require('body-parser');

app.use(express.urlencoded());

app.use(cookieParser())

//tell layout before the routes
//for all routes
app.use(expressLayouts)

//extract style and scripots from sub pages into the  the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


app.use(express.static('./assets'));


app.use('/', require('./routes/index'));

//setting up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');


//if not specified, will by defualt for the layout file inside the views -> layouts -> layout.ejs
// app.set('layout', 'dhakka');


//user express route
//will be use for each type of request at '/'
//requests starting with '/zero' will be handled by this router like '/zero/anything'
// app.use('/zero', require('./routes/index'));
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