var mongoose = require('mongoose');

var DB = async function(){
   try {
    await mongoose.connect('mongodb://localhost:27017/profilebuilder',{
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    console.log('database connected')
   } catch (error) {
       console.log(error)
       process.exit(1)
   }
};

module.exports = DB;