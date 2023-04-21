module.exports.setFlash = function(req, res, next)
{
    //set messages into the locals of response
    res.locals.flash = {
        //theses values in req are added by connect-flash and once retrived they are marked as consumed
        'success': req.flash('success'), //extract success message
        'error' : req.flash('error') //extract success message
    }
    next();
}