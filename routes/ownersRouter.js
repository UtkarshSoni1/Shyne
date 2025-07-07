const express = require('express');
const ownerModel = require('../models/owner-model');
const router = express.Router();
const flash = require('flash');
const session = require('express-session');
const productModel = require('../models/product-model');

router.use(express.json());
router.use(express.urlencoded({extended : true}));

router.get('/',(req, res) => {
    res.send("Welcome to Owners Page");
});

console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === "development"){
    router.post('/create',async (req, res) => {
        let owner = await ownerModel.find();
        if(owner.length>0){
            return res
            .status(503)
            .send("you don't have permission to create an owner"); 
        }

        let {fullname, email, password} = req.body;

        let createdOwner = await ownerModel.create({
            fullname,
            email,
            password,
        });
        res.status(201).send(createdOwner);
    })
};

router.get('/admin',(req, res) => {
    res.send("Admin Page");
});

router.post('/product/create',async (req, res) => {
    let {name, price, discount, bgcolor, panelcolor, textcolor} = req.body;
    const image = req.file ? `./public/uploads/${req.file.filename}` : undefined;
    let product = productModel.find({name: name});
    if( product.length > 0){
        req.flash('error', 'product already exists');
        return res.redirect('/product/create');
    }
    let createdProduct = await productModel.create({
        image,
        name,
        price,
        discount,
        bgcolor,
        panelcolor,
        textcolor
    });
})

module.exports = router;