module.exports.hi = function(req, res){
    res.end('<h1>Hello world </h1>');
}

module.exports.bye = function(req, res)
{
    res.end('<h1> bye world </h1>');
}