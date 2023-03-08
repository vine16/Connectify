//entery point for all the routes
const express = require('express'); //will not creater the new instance

const router = express.Router(); //making an object 'router'
const homeController = require('../controllers/home_controller');


//'/zero/home' will be handled here
router.get('/home', homeController.bye);

module.exports = router;



