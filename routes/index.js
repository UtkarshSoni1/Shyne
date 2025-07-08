const express = require('express');
const router = express.Router();



router.get('/',(req, res) => {
    res.render('index');
})

router.get('/shop',(req, res) => {
    // let products = productModel.find();
    // res.render('shop', {products});
    res.render('shop');
})

module.exports = router;