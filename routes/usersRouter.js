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
    try{res.render('login');}
    catch(err){
        res.send(err.message);
    }
});
router.post('/login', userLogin);

router.get('/cart/:id',async (req, res) => {
    try{
        let user = await userModel.findOne({_id : req.params.id}).populate('cart');
        res.render('cart',{user});
    }
    catch(err){
        res.send(err.message);
    }
});
router.get('/account/:id',(req, res) => {
    try{res.send('welcome to account !!')}
    catch(err){
        res.send(err.message);
    }
});

module.exports = router;