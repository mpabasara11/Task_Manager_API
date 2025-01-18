const mongoose = require('mongoose');

// task schema
const taskLogSchema = new mongoose.Schema({
    id: String,
    taskName: String,
    userName: String,
    toDo: String,
    progress: Number,
    assignedStoryPoints: Number
    // other fields if needed...
    });

    
// Create a model from the schema
module.exports=mongoose.model('Task_User_Log', taskLogSchema);