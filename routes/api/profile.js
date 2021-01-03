var express = require('express');
var router = express.Router();

router.get('/',(req,res) => {
    res.send('profile panel')
})

module.exports = router