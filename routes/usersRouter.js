const express = require('express');
const userModel = require('../models/user-model');
const router = express.Router();
const {userRegister,userLogin } = require('../controllers/authController');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



router.use(express.json()); // for parsing application/json
router.use(express.urlencoded({ extended: true })); // for parsing form submissions (application/x-www-form-urlencoded)


router.get('/',(req, res) => {
    res.send("Welcome to Users Page");
});

router.post('/register',userRegister);

router.get('/login',(req, res) => {
    res.render('login');
});
router.post('/login', userLogin);


module.exports = router;