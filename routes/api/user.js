var express = require('express');
var router = express.Router();
var {check,validationResult} = require('express-validator');
var User = require('../../model/User');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


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
        var salt = await bcrypt.genSalt(10);
        var hashed = await bcrypt.hash(password,salt)
        user.password = hashed;
        await user.save() //insertOne/insertMany
        res.status(200).json(user)

    } catch (error) {
        console.error(error)
        res
        .status(500)
        .send('server error')
    }
})


//@method    POST
//@path      /user/login
//@access    Public
router.post('/login',[
    check('email')
    .notEmpty()
    .withMessage('email can not be empty')
    .isEmail()
    .withMessage('email is not valid'),
    check('password')
    .notEmpty()
    .withMessage('password can not be empty')
],async (req,res) => {
    var errors =  validationResult(req);
    if (!errors.isEmpty()) {
        return res
        .status(400)
        .json({ errors: errors.array() });
    }
    try {
        const {email,password} = req.body;
        var user = await User.findOne({email})
        var isMatch = await bcrypt.compare(password,user.password)?true:false;
        if(!user || isMatch === false){
            return res.status(401).send("invalid credentials");
        }

        var data = {
            id:user.id,
            email:user.email
        }
        jwt.sign({
            data,
            exp:Math.floor(Date.now() / 1000) + (60 * 60)*24},
            "mysecret",
            (err,token) => {
                if(err) throw err;
                res.json(token)
        })
        

    } catch (error) {
        console.error(error)
        res.status(500).send('internal server error')
    }
})
module.exports = router