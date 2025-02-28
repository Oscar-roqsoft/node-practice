const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    name: 
    //validate name input value
    {
        type: String,  
        required: [true,'must provide the name'],
        maxLength:20,
    },
    completed:
    { 
        type:Boolean,
        default:false

    },
    createdAt: { type: Date, default: Date.now },
    modifiedAt: { type: Date, default: Date.now },

})





module.exports = mongoose.model("tasks", TaskSchema);