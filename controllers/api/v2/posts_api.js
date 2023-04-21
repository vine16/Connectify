module.exports.index = function(req, res){
    return res.status(200).json({
        message: 'list of posts from version 2',
        posts: []
    })
}