//entery point for all the routes
const express = require('express'); //will not creater the new instance

const router = express.Router(); //making an object 'router'
const homeController = require('../controllers/home_controller');


//'/zero/home' will be handled here
router.get('/', homeController.home);

router.use('/users', require('./users'));


router.use('/posts', require('./posts'));

router.use('/comments', require('./comments'));
//for any furter routes, access from here
//router.use('/routerName', require('/routerfile'));

module.exports = router;