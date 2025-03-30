const mongoose = require('mongoose')

const newSchema =new  mongoose.Schema({
    titre: {type:String, required: true},
    projet_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    description: {type:String, required: true},
    priorite: {type:String,
        enum: ['faible', 'moyen', 'urgent'],
        default: 'faible', required:true
    },
    status: {
        type: String,
        enum: ["En cours", "Terminé", "En attente"],
        default: "En attente",
      },
    users:[
        {type:mongoose.Schema.Types.ObjectId,ref:"User"}
    ],
    deadline: {type:String}
})

const Task = mongoose.model('Task',newSchema);
module.exports = Task;