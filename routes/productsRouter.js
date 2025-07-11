const express = require('express');
const router = express.Router();
const productModel = require('../models/product-model');
const { urlencoded } = require('body-parser');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/',(req, res) => {
    res.send("Welcome to Products Page");
});

// router.get('/create', (req, res) => {
//     res.render('create');
// });

// router.post('/create',upload.single('image'), async (req,res) => {
//     let {name,price,discount,bgcolor,panelcolor,textcolor} = req.body;
//     let image = req.file.filename;
//     let createdProduct = await productModel.create({
//         image,
//         name,
//         price,
//         discount,
//         bgcolor,
//         panelcolor,
//         textcolor
//     });
//     res.send(createdProduct);
// })

module.exports = router;