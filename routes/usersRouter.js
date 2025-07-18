const express = require('express');
const userModel = require('../models/user-model');
const productModel = require('../models/product-model');
const router = express.Router();
const {userRegister,userLogin } = require('../controllers/authController');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const isLoggedIn = require('../middlewares/isLoggedIn');



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
router.get('/cart/orders/:id',async (req, res) => {
    try{
        let user = await userModel.findOne({ _id: req.body.id }).populate('cart');
        res.render('order',{user});
    }
    catch(err){
        res.send(err.message);
    }
});
router.get('/orders/:id',isLoggedIn,async (req, res) => {
    try{
        let user = await userModel.findOne({_id : req.user.id}).populate('cart');
        let product = await productModel.findOne({_id : req.params.id});
        res.render('order',{user,product});
    }
    catch(err){
        res.send(err.message);
    }
});
router.post('/address/:id',async (req, res) => {
    try{
        // let user = await userModel.findOne({_id : req.params.id}).populate('cart');
        const { address, pincode } = req.body;
        // const newimage = req.file ? req.file.path : undefined;

        const updateData = {
            address,
            pincode
        };

    await userModel.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.redirect(`/users/orders/${req.params.id}`);
    }
    catch(err){
        res.send(err.message);
    }
});
router.get('/account/:id',isLoggedIn,(req, res) => {
    try{
        let user = req.user;
        res.render('account',{user});
    }
    catch(err){
        res.send(err.message);
    }
});

module.exports = router;