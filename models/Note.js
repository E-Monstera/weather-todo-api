const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for notes
let NoteSchema = new Schema(
    {
        content: {type:String, required:true},
        title: {type:String, required:true},
        author: {type:Schema.Types.ObjectId, ref:'User', required:true}
    }
)

module.exports = mongoose.model('Note', NoteSchema);