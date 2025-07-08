const express = require('express');
const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateToken = require("../utils/generateToken");
const flash = require('flash');

const userRegister = async (req, res) => {
    try{
        let {fullname, email, password} = req.body;

        let user = await userModel.find({ email:email});
        if(user.length > 0){
            res.status(400).send("you already have an account please login");
        }
        bcrypt.genSalt(10, async (err, salt) =>{
            if (err) return res.send(err.message);
            bcrypt.hash(password, salt,async (err, hash) => {
                if(err) console.log(err.message);
                const createdUser = await userModel.create({
                    fullname,
                    email,
                    password:hash,
                });
                const token =  await generateToken(createdUser);
                res.cookie("token",token);
                return res.send(createdUser);
            });
        });
    }
    catch(err){
        res.send(err.message);
    }
}

const userLogin = async (req, res) => {
    let {email, password} = req.body;
    let user = await userModel.findOne({email: email});
    if(!user){
        return res.status(400).send("user not found, please resigter");
    }
    await bcrypt.compare(password, user.password, async (err, result) => {
        
        if(err) return res.status(400).send('email or password incorrect');
        if(result){
            const token = generateToken(user);
            res.cookie("token",token);
            res.send('login successful');
        }
    });
}

module.exports = {
    userRegister,
    userLogin
};
