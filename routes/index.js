const express = require('express');
const productModel = require('../models/product-model');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const userModel = require('../models/user-model');
const { message, redirect } = require('statuses');

router.get('/',(req, res) => {
    res.render('index');
})

router.get('/shop/:id',isLoggedIn,async (req, res) => {
    // let products = productModel.find();
    // res.render('shop', {products});
    let product = await productModel.find();
    // console.log(product);
    let user = await userModel.findOne({_id: req.params.id})
    // res.send(req.flash('message'));
    let success = req.flash("success");
    let info = req.flash("info");
    res.render('shop',{product, user, success, info});
})

router.get('/addtocart/:id',isLoggedIn, async(req, res) => {
    try{
        let user = await userModel.findOne({ _id: req.user._id}).populate('cart').exec();
        if(!user){
            res.status(500).send("user not Found")
        }
        const productId = req.params.id;
        const alreadyExists = user.cart.some(item => item._id.toString() === productId);

        if (!alreadyExists) {
            user.cart.push(productId);
            await user.save();
            req.flash('success', 'Added to cart');
            
            res.redirect(`/shop/${user.id}`);
            // res.send();
        } else {
            req.flash('info', 'Product already in cart');
            // res.redirect(`/shop/${user.id}`);
            // res.redirect('shop',req.flash('info'));
            // window.alert(req.flash('message'))
            res.redirect(`/shop/${user.id}`);
        }
    }
    catch(err){
        res.status(400).send(err.message)
    }
})

router.get('/removefromcart/:id',isLoggedIn, async (req, res) => {
    try{
        let user = await userModel.findOne({_id: req.user._id}).populate('cart').exec();
        let productId = req.params.id;
        if(user){
            user.cart.pull(productId);
            await user.save();
            return res.redirect(`/users/cart/${user.id}`);
        }else{
            return res.send('something went wrong');
        }
    }
    catch(err){
        return res.send(err.message);
    }
})

module.exports = router;