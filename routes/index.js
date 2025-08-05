const express = require('express');
const productModel = require('../models/product-model');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const userModel = require('../models/user-model');

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
    res.render('shop',{product, user});
})

router.get('/addtocart/:id',isLoggedIn, async(req, res) => {
    try{
        let user = await userModel.findOne({ _id: req.user._id}).populate('cart').exec();
        if(!user){
            req.flash('error', 'User not found');
            return res.redirect(`/shop/${req.user._id}`);
        }
        const productId = req.params.id;
        const alreadyExists = user.cart.some(item => item._id.toString() === productId);

        if (!alreadyExists) {
            user.cart.push(productId);
            await user.save();
            req.flash('success', 'Product added to cart successfully!');
            return res.redirect(`/shop/${user.id}`);
        } else {
            req.flash('info', 'Product is already in your cart');
            res.redirect(`/shop/${user.id}`);
        }
    }
    catch(err){
        req.flash('error', 'Failed to add product to cart: ' + err.message);
        res.redirect(`/shop/${req.user._id}`);
    }
})

router.get('/removefromcart/:id',isLoggedIn, async (req, res) => {
    try{
        let user = await userModel.findOne({_id: req.user._id}).populate('cart').exec();
        let productId = req.params.id;
        if(user){
            user.cart.pull(productId);
            await user.save();
            req.flash('success', 'Product removed from cart successfully!');
            return res.redirect(`/users/cart/${user.id}`);
        }else{
            req.flash('error', 'Something went wrong');
            return res.redirect(`/users/cart/${user.id}`);
        }
    }
    catch(err){
        req.flash('error', 'Failed to remove product: ' + err.message);
        return res.redirect(`/users/cart/${req.user._id}`);
    }
})

// Dummy Payment Routes
router.get('/dummy-payment/:userId', isLoggedIn, async (req, res) => {
    try {
        const user = await userModel.findById(req.params.userId).populate('cart');
        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/');
        }

        // Calculate total amount
        let totalAmount = 0;
        user.cart.forEach(item => {
            totalAmount += (item.price + 20 - item.discount);
        });

        res.render('dummy-payment', { user, totalAmount });
    } catch (error) {
        console.error('Error in dummy payment:', error);
        req.flash('error', 'Something went wrong');
        res.redirect('/');
    }
});
router.get('/dummy-payment-single/:productId', isLoggedIn, async (req, res) => {
    try {
        // const user = await userModel.findById(req.params.userId).populate('cart');
        // console.log(req.params.id);
        
        const product = await productModel.findOne({_id: req.params.productId});
        const user = req.user;
        // console.log(product);
        // if (!user) {
        //     req.flash('error', 'User not found');
        //     return res.redirect('/');
        // }

        // Calculate total amount
        let totalAmount = product.price - product.discount + 20;
        // user.cart.forEach(item => {
        //     totalAmount += (item.price + 20 - item.discount);
        // });

        res.render('dummy-payment-single', { user, totalAmount, product });
    } catch (error) {
        console.error('Error in dummy payment:', error);
        req.flash('error', 'Something went wrong');
        res.send(error);
    }
});
router.get('/api/dummy-payment-single-success/:productId', isLoggedIn, async (req, res) => {
    try {
        const user = req.user;
        const productId = req.params.productId;

        // Remove only the single product from the user's cart
        user.cart = user.cart.filter(item => item.toString() !== productId);
        await user.save();

        req.flash('success', 'Product removed from cart after payment.');
        res.redirect(`/users/cart/${user._id}`);
    } catch (error) {
        console.error('Error removing single product from cart after payment:', error);
        req.flash('error', 'Could not remove product from cart');
        res.redirect('/');
    }
});

router.get('/api/dummy-payment-success', isLoggedIn, async (req, res) => {
    try {
        const { amount, user } = req.query;
        
        // Clear the user's cart after successful payment
        const userDoc = await userModel.findById(user);
        if (userDoc) {
            userDoc.cart = [];
            await userDoc.save();
        }
        
        req.flash('success', `Payment successful! Your order of ₹${amount} has been placed.`);
        res.redirect(`/users/cart/${user}`);
    } catch (error) {
        console.error('Error in dummy payment success:', error);
        req.flash('error', 'Payment verification failed');
        res.redirect('/');
    }
});

router.get('/test-flash',(req, res) => {
    req.flash('success', 'This is a test success message!');
    req.flash('error', 'This is a test error message!');
    req.flash('info', 'This is a test info message!');
    res.redirect('/');
})

module.exports = router;