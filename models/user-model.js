const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        minLenght: 3,
        trim: true,
    },
    email: String,
    password: String,
    address: String,
    mobile: Number,
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
    }],
    pincode: Number,
    picture: String,
});

module.exports  = mongoose.model("user", userSchema);