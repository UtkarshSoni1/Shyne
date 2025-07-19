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
    try{
        res.render('login');
    }
    catch(err){
        req.flash('error', err.message);
        res.redirect('/');
    }
});
router.post('/login', userLogin);
router.get('/logout', (req, res) => {
    res.cookie("token","");
    res.redirect('/users/login');
})

router.get('/cart/:id',async (req, res) => {
    try{
        let user = await userModel.findOne({_id : req.params.id}).populate('cart');
        res.render('cart',{user});
    }
    catch(err){
        req.flash('error', err.message);
        res.redirect('/');
    }
});
router.get('/cart/orders/:id',async (req, res) => {
    
        let user = await userModel.findOne({ _id: req.params.id }).populate('cart');
        res.render('orderAll',{user});
    
    
});
router.get('/orders/:id',isLoggedIn,async (req, res) => {
    try{
        let user = await userModel.findOne({_id : req.user.id}).populate('cart');
        let product = await productModel.findOne({_id : req.params.id});
        res.render('order',{user,product});
    }
    catch(err){
        req.flash('error', err.message);
        res.redirect('/');
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
        req.flash('error', err.message);
        res.redirect('/');
    }
});

// Update user name
router.put('/update/name/:id', isLoggedIn, async (req, res) => {
    try {
        const { name } = req.body;
        const updatedUser = await userModel.findByIdAndUpdate(
            req.params.id, 
            { fullname: name }, 
            { new: true }
        );
        req.flash('success', 'Name updated successfully!');
        res.redirect(`/users/account/${req.params.id}`);
    } catch(err) {
        req.flash('error', 'Failed to update name: ' + err.message);
        res.redirect(`/users/account/${req.params.id}`);
    }
});

// Update user email
router.put('/update/email/:id', isLoggedIn, async (req, res) => {
    try {
        const { email } = req.body;
        const updatedUser = await userModel.findByIdAndUpdate(
            req.params.id, 
            { email: email }, 
            { new: true }
        );
        req.flash('success', 'Email updated successfully!');
        res.redirect(`/users/account/${req.params.id}`);
    } catch(err) {
        req.flash('error', 'Failed to update email: ' + err.message);
        res.redirect(`/users/account/${req.params.id}`);
    }
});

// Update user mobile
router.put('/update/mobile/:id', isLoggedIn, async (req, res) => {
    try {
        const { mobile } = req.body;
        const updatedUser = await userModel.findByIdAndUpdate(
            req.params.id, 
            { mobile: mobile }, 
            { new: true }
        );
        req.flash('success', 'Mobile number updated successfully!');
        res.redirect(`/users/account/${req.params.id}`);
    } catch(err) {
        req.flash('error', 'Failed to update mobile: ' + err.message);
        res.redirect(`/users/account/${req.params.id}`);
    }
});

module.exports = router;