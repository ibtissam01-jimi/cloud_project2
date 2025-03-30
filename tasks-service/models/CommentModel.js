const mongoose = require('mongoose')


const newSchema = mongoose.Schema({
    user_id:{type: String},
    task_id:{type: mongoose.Schema.Types.ObjectId},
    comment: {type:String}
})

const Comment = mongoose.model('Comment', newSchema);
module.exports = Comment;