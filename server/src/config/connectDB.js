const mongoose = require('mongoose');

function connect() { 
    const URL = process.env.MONGODB_URL  
    mongoose.connect(URL,(err)=>{
        if(err) throw err;
        console.log('connect database successfully');
    })
}
module.exports = connect