const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for projects
let ProjectSchema = new Schema(
    {
        title: {type:String, required:true}
    }
)

module.exports = mongoose.model('Project', ProjSchema);