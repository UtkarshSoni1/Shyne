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
    res.render('shop',{product, user});
})

module.exports = router;