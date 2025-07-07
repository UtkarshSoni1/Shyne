const jwt = require('jsonwebtoken');
const userModel = require('../models/user-model');
const flash = require('flash');
const session = require('express-session');

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
        req.flash('error', 'you are not logged In');
      return res.redirect('/login'); 
    }
    
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const user = await userModel.findOne({email : decoded.email})
        .select("-password");
    if (!user) {
      return res.send('you are not logged In'); 
    }

    req.user = user; 
    next();
  } catch (err) {
    req.flash('error', 'something went wrong');
    return res.redirect('/');
  }
};