var mongoose = require('mongoose');
var User = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

var UserModel = mongoose.model('user',User);

module.exports = UserModel