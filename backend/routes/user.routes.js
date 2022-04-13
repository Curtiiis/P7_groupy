const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controllers');
const passwordValidator = require('../middleware/password-validator');

//CRUD Post and comments
router.post('/signup', passwordValidator, userCtrl.signup);
router.post('/login', userCtrl.login);
router.post('/forgot', userCtrl.forgot);

// router.get('/user', userCtrl.getOneUser)


module.exports = router;

