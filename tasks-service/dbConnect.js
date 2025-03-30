const mongoose = require('mongoose');

function check(){

    mongoose.connect('mongodb+srv://ameurelmoukh05:vrScV1KCrFynIGIB@cluster0.xupwd.mongodb.net/projectManagement?retryWrites=true&w=majority&appName=Cluster0')
    .then(()=>console.log('connected'))
    .catch((error)=>console.log(error))
}

module.exports= {check};