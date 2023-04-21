const mongoose = require('mongoose'); //using mongoose library
const multer = require('multer');

const path = require('path');

const AVATAR_PATH = path.join('/uploads/users/avatars');
//linking avatarPath, malar and avatar field
//making sure whenever i upload a file it gets saved in this folder

const userSchema = mongoose.Schema({
    //fields and their types and validations
    email:{                         
        type: String,               
        required: true,             
        unique: true                
    },                                  
    password:{
        type: String,
        required : true
    },      
    name:   
    {       
        type: String,
        required: true
    },
    //file path will be stored here
    avatar:{
        type: String
    } 
}, {
    timestamps: true, //Adds createdAt and updatedAt fields to the schema, which are automatically set to the current date and time when a document is created or updated.
    // versionKey: 'vinay', //default is '__v'
    //strict : 'true', //Mongoose will only save properties that are defined in the schema
})


let storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, path.join(__dirname, '..', AVATAR_PATH ))
    },
    filename: function(req, file, cb){
        //fieldname = avatar(from form)
        cb(null, file.fieldname + '-' + Date.now())
    }
})


//static method defined on the whole schems, not on different docs
//assigning diff properties to multer's storage property
//multer bro, extract this single file from form from user with name as 'avatar'
userSchema.statics.uploadedAvatar = multer({storage: storage}).single('avatar');
userSchema.statics.avatarPath = AVATAR_PATH; //making it publicily available


//"User" -> model name,
//model -> defines the structure of the documents that will be stored in that collection
//if no third argument -> "Users" will the name of collection
// mongoose.model(modelName, schema, collectionName);
const User = mongoose.model('User', userSchema);


module.exports = User;