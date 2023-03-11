const mongoose = require('mongoose'); //using mongoose library

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
    }
}, {
    timestamps: true, //Adds createdAt and updatedAt fields to the schema, which are automatically set to the current date and time when a document is created or updated.
    // versionKey: 'vinay', //default is '__v'
    //strict : 'true', //Mongoose will only save properties that are defined in the schema
})


//"User" -> model name,
//model -> defines the structure of the documents that will be stored in that collection
//if no third argument -> "Users" will the name of collection
// mongoose.model(modelName, schema, collectionName);
const User = mongoose.model('User', userSchema);

module.exports = User;