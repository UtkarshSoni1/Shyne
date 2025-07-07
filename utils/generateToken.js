const jwt = require('jsonwebtoken');


function generateToken(user) {
    const token = jwt.sign({ email : user.email, id: user._id }, process.env.JWT_KEY, { expiresIn: '1h' });
    return token;
}

module.exports = generateToken;