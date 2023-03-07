
const express = require('express');

const app = express();
const port = 2000;

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