const express = require('express');

const router = express.Router();

const personController = require('../controllers/users_controller')

console.log('person,js');

router.get('/person', personController.person);
router.get('/', personController.post);
module.exports = router;