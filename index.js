
const express = require('express');

const app = express();
const port = 2000;


//user express route
//will be use for each type of request at '/'
//requests starting with '/zero' will be handled by this router
// app.use('/zero', require('./routes/index'));
app.use('/', require('./routes/index'));


//if router don't handle this '/' request, the request will come here
app.get('/', function(req, res)
{
    res.send('hello world');
})



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