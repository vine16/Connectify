module.exports.home = function(req, res){
    // res.end('<h1>Welcome to home</h1>');
    console.log(req.cookies);

    //cooking coming with request and going back with the response
    res.cookie('user_id', 299);
    return res.render('home', {
        title: "home"
    });
}


// module.exports.bye = function(req, res)
// {
//     res.end('<h1> bye world </h1>');
// }