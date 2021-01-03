var express = require('express');
var router = express.Router();
var {check,validationResult} = require('express-validator');
var User = require('../../model/User');
//@method    GET
//@path      /user
//@access    Public
router.get('/',(req,res) => {
    res.send('user panel')
})

//@method    POST
//@path      /user
//@access    Public
router.post('/',[
    check('email')
    .notEmpty()
    .withMessage('email can not be empty')
    .isEmail()
    .withMessage('email is not valid'),
    check('password')
    .notEmpty()
    .withMessage('password can not be empty')
    .isLength({min:8})
    .withMessage('password should be minimum of 8 characters')
],
async (req,res) => {
    var errors =  validationResult(req);
    if (!errors.isEmpty()) {
        return res
        .status(400)
        .json({ errors: errors.array() });
    }
    try {
        var {email,password} = req.body
        var user = await User.findOne({"email":email});
        if(user){
            return res
            .status(400)
            .json({error:"user exists"})
        }

        user = new User({email,password})
        await user.save() //insertOne/insertMany
        res.status(200).json(user)
    } catch (error) {
        console.error(error)
        res
        .status(500)
        .send('server error')
    }
})

module.exports = router