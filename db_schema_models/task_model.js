const mongoose = require('mongoose');

// task schema
const taskSchema = new mongoose.Schema({
    taskName: String,
    taskDescription: String,
    taskDeadline: Date,
    taskStatus: String,
    taskCreatedBy: String,
    taskPriority: String,
    taskTotalStoryPoints: Number
    // other fields if needed...
    });

// Create a Task model from the schema
module.exports=mongoose.model('Task', taskSchema);