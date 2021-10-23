const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for users
//Could add an 'additional_locations' section
let UserSchema = new Schema(
    {
        username: {type:String, required:true},
        email: {type:String, required:true, unique:true},
        password: {type:String, required:true},
        location: {type:String, required:false}
    }
)

module.exports = mongoose.model('User', UserSchema);