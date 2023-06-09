const express = require('express');
const passport = require('passport');
const router = express.Router();

const postController = require('../controllers/posts_controller');

router.post('/create', passport.checkAuthentication, postController.createPost);

router.get('/destroy/:id', passport.checkAuthentication, postController.destroy);


module.exports = router;