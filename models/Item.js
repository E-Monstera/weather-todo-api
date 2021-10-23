const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for users
//Could add an 'additional_locations' section
let ItemSchema = new Schema(
    {
        title: {type:String, required:true},
        desc: {type:String, required:true},
        priority: {type:Number, required:true},
        category: {type:Schema.Types.ObjectId, ref:'project', required:false},
        author: {type:Schema.Types.ObjectId, ref:'User', required:true},
        due_date: {type:Date, required: true}
    }
)

module.exports = mongoose.model('Item', ItemSchema);