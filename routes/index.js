const express = require('express');
const productModel = require('../models/product-model');
const router = express.Router();



router.get('/',(req, res) => {
    res.render('index');
})

router.get('/shop',async (req, res) => {
    // let products = productModel.find();
    // res.render('shop', {products});
    let product = await productModel.find();
    // console.log(product);
    res.render('shop',{product});
})

module.exports = router;