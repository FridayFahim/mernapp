var express = require('express');
var app = express();
var port = 4000;
var user = require('./routes/api/user');
var auth = require('./routes/api/auth');
var profile = require('./routes/api/profile');
var DB = require('./config/DB');
// database connection
DB()

//middleware
//will only accept json string
app.use(express.urlencoded({extended:false}))
//json parser 
//body parser
//object
app.use(express.json())

// api path
app.use('/user',user)
app.use('/auth',auth)
app.use('/profile',profile)

app.listen(port,(err) => {
    if(err) throw err;
    console.log(`server is running on port ${port}`)
})