const express = require('express');
const ownerModel = require('../models/owner-model');
const router = express.Router();
const flash = require('flash');
const session = require('express-session');
const productModel = require('../models/product-model');
const upload = require('../utils/multer-config')


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

router.get('/admin',async (req, res) => {
    try{
        let product = await productModel.find();
        res.render('admin',{product});
    }
    catch(err){
        req.flash(err.message);
    }
});

router.get('/products/create',async (req,res) => {
    res.render('create');
})

router.post('/products/create',upload.single('image'), async (req, res) => {
    try{
        let {name, price, discount, bgcolor, panelcolor, textcolor} = req.body;
        const image = req.file.filename;
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
        res.redirect('/owners/admin');
    }
    catch(err){
        res.send(err.message);
    }
})

module.exports = router;