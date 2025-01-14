const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../db_schema_models/user_model.js');
const Task = require('../db_schema_models/task_model.js');
const bcrypt = require('bcrypt');


//middleware for checking request object contain a userRole as manager
router.use((req,res,next) => {
    if(req.userRole === 'admin')
    {
        next();
    }
    else
    {
        res.status(403).json({error:'Forbidden'});
    }
}
)



//create task
router.post('/create_task', (req, res) => {
    const taskName = req.body.taskName
    const taskDescription = req.body.taskDescription
    const taskDeadline = req.body.taskDeadline
    const taskStatus = req.body.taskStatus
    const taskAssignedTo = req.body.taskAssignedTo
    const taskAssignedBy = req.userName

   //check if task already exists with taskName
   Task.findOne({taskName:taskName})
    .then(task => {
         if(task)
         {
              console.log('Task already exists');
              res.status(409).json({error:'Task already exists'});
         }
         else
         {
           
    //check if task assignee exists
    User.findOne({userName:taskAssignedTo})
    .then(user => 
        {
            if(user)
                {
                    const newTask = new Task({
                        taskName:taskName,
                        taskDescription:taskDescription,
                        taskDeadline:taskDeadline,
                        taskStatus:taskStatus,
                        taskAssignedTo:taskAssignedTo,
                        taskAssignedBy:taskAssignedBy
                    })
                
                    newTask.save()
                    .then(() => {
                        console.log('Task created');
                        res.status(200).json({message:'Task created'});
                    })
                    .catch((error) => {
                        console.log('Error creating task');
                        res.status(500).json({error:'Error creating task'});
                    })
                }
                else
                {
                    console.log('User assigned to the task not found');
                    res.status(404).json({error:'User assigned to the task not found'});
                }
        })
         }
    })



})


//update task
router.put('/update_task', (req, res) => {
    const taskName = req.body.taskName
    const taskDescription = req.body.taskDescription
    const taskDeadline = req.body.taskDeadline
    const taskStatus = req.body.taskStatus
    const taskAssignedTo = req.body.taskAssignedTo
    const taskAssignedBy = req.userName

    Task.findOne({taskName:taskName})
    .then(task => 
        {
            if(task)
                {
                    //check if task assignee exists
                    User.findOne({userName:taskAssignedTo})
                    .then(user => 
                        {
                            if(user)
                                {
                                    Task.updateOne({taskDescription:taskDescription, taskDeadline:taskDeadline, taskStatus:taskStatus, taskAssignedTo:taskAssignedTo, taskAssignedBy:taskAssignedBy})
                                    .then(() => {
                                        console.log('Task updated');
                                        res.status(200).json({message:'Task updated'});
                                    })
                                    .catch((error) => {
                                        console.log('Error updating task');
                                        res.status(500).json({error:'Error updating task'});
                                    })
                                }
                                else
                                {
                                    console.log('User assigned to the task not found');
                                    res.status(404).json({error:'User assigned to the task not found'});
                                }
                        })
                }
                else
                {
                    console.log('Task not found');
                    res.status(404).json({error:'Task not found'});
                }
        })

})

//view tasks
router.get('/view_tasks', (req, res) => {
    Task.find()
    .then(tasks => {
        console.log('Tasks found');
        res.status(200).json(tasks);
    })
    .catch((error) => {
        console.log('Error finding tasks');
        res.status(500).json({error:'Error finding tasks'});
    })
})

//view task by name
router.get('/view_task_by_name', (req, res) => {
    const taskName = req.body.taskName
    Task.findOne({taskName:taskName})
    .then(task => {
        if(task)
        {
            console.log('Task found');
            res.status(200).json(task);
        }
        else
        {
            console.log('Task not found');
            res.status(404).json({error:'Task not found'});
        }
    })
})


//delete task
router.delete('/delete_task', (req, res) => {
    const taskName = req.body.taskName

    //check if task exists
    Task.findOne({taskName:taskName})
    .then(task => {
        if(task)
        {
            task.deleteOne()
            .then(() => {
                console.log('Task deleted');
                res.status(200).json({message:'Task deleted'});
            })
            .catch((error) => {
                console.log('Error deleting task');
                res.status(500).json({error:'Error deleting task'});
            })
        }
        else
        {
            console.log('Task not found');
            res.status(404).json({error:'Task not found'});
        }
    })
})
    


//assign task


















module.exports = router;