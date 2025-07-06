const express = require('express');
const router = express.Router();

router.get('/',(req, res) => {
    res.send("Welcome to Users Page");
});

module.exports = router;