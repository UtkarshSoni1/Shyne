const express = require('express');
const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateToken = require("../utils/generateToken");

const userRegister = async (req, res) => {
    try{
        let {fullname, email, password} = req.body;

        let user = await userModel.find({ email:email});
        if(user.length > 0){
            req.flash('error', 'You already have an account, please login');
            return res.redirect('/');
        }
        bcrypt.genSalt(10, async (err, salt) =>{
            if (err) {
                req.flash('error', err.message);
                return res.redirect('/');
            }
            bcrypt.hash(password, salt,async (err, hash) => {
                if(err) {
                    req.flash('error', err.message);
                    return res.redirect('/');
                }
                const createdUser = await userModel.create({
                    fullname,
                    email,
                    password:hash,
                });
                const token =  await generateToken(createdUser);
                res.cookie("token",token);
                req.flash('success', 'Registration successful!');
                return res.redirect(`/shop/${createdUser._id}`);
            });
        });
    }
    catch(err){
        req.flash('error', err.message);
        res.redirect('/');
    }
}

const userLogin = async (req, res) => {
    try {
        let {email, password} = req.body;
        let user = await userModel.findOne({email: email});
        if(!user){
            req.flash('error', 'User not found, please register');
            return res.redirect('/users/login');
        }
        await bcrypt.compare(password, user.password, async (err, result) => {
            
            if(err) {
                req.flash('error', 'Email or password incorrect');
                return res.redirect('/users/login');
            }
            if(result){
                const token = generateToken(user);
                res.cookie("token",token);
                req.flash('success', 'Login successful!');
                return res.redirect(`/shop/${user._id}`);
            } else {
                req.flash('error', 'Email or password incorrect');
                return res.redirect('/users/login');
            }
        });
    } catch(err) {
        req.flash('error', 'Login failed: ' + err.message);
        res.redirect('/users/login');
    }
}

module.exports = {
    userRegister,
    userLogin
};
