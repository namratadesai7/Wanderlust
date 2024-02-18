const mongoose= require("mongoose");
const Schema= mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose"); //passport and passport-local are enough if you are using any other db that is SQL but if you are using mongoose this package give diff functionalities

const userSchema= new Schema({
     email:{
        type:String,
        required:true
     }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',userSchema); 




