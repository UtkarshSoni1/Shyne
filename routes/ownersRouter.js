const express = require('express');
const ownerModel = require('../models/owner-model');
const router = express.Router();

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

module.exports = router;