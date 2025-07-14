const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        minLenght: 3,
        trim: true,
    },
    email: String,
    password: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        default: [],
    },
    orders: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        default: [],
    },
    contact: Number,
    picture: String,
});

module.exports  = mongoose.model("user", userSchema);