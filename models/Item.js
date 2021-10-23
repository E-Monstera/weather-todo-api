const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for items
let ItemSchema = new Schema(
    {
        title: {type:String, required:true},
        desc: {type:String, required:false},
        priority: {type:Number, required:true},
        project: {type:Schema.Types.ObjectId, ref:'project', required:false},
        author: {type:Schema.Types.ObjectId, ref:'User', required:true},
        due_date: {type:Date, required: true},
        completed: {type: Boolean, required: true}
    }
)

module.exports = mongoose.model('Item', ItemSchema);