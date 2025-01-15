const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../db_schema_models/user_model.js');
const Task = require('../db_schema_models/task_model.js');
const Task_User_Log = require('../db_schema_models/task_user_log_model.js');
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
    const taskCreatedBy = req.body.taskCreatedBy
    const taskPriority = req.body.taskPriority

  
           
    //check if task assignee exists
    User.findOne({userName:taskCreatedBy})
    .then(user => 
        {
            if(user)
                {
                    //check task name is unique
                    Task.findOne({taskName:taskName})
                    .then(task => 
                        {
                            if(task)
                                {
                                    console.log('Task name already exists');
                                    res.status(409).json({error:'Task name already exists'});
                                }
                                else
                                {
                                    const newTask = new Task({
                                        taskName:taskName,
                                        taskDescription:taskDescription,
                                        taskDeadline:taskDeadline,
                                        taskStatus:taskStatus,
                                        taskCreatedBy:taskCreatedBy,
                                        taskPriority:taskPriority
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
                        })
                }
                else
                {
                    console.log('User created the task does not exist');
                    res.status(404).json({error:'User created the task does not exist'});
                }
        })
         
    



})


//update task
router.put('/update_task', (req, res) => {
    const taskName = req.body.taskName
    const taskDescription = req.body.taskDescription
    const taskDeadline = req.body.taskDeadline
    const taskStatus = req.body.taskStatus
    const taskCreatedBy = req.body.taskCreatedBy
    const taskPriority = req.body.taskPriority

    Task.findOne({taskName:taskName})
    .then(task => 
        {
            if(task)
                {
                    //check if task assignee exists
                    User.findOne({userName:taskCreatedBy})
                    .then(user => 
                        {
                            if(user)
                                {
                                    Task.updateOne({taskDescription:taskDescription, taskDeadline:taskDeadline, taskStatus:taskStatus, taskCreatedBy:taskCreatedBy, taskPriority:taskPriority})
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
                                    console.log('User created the task does not exist');
                                    res.status(404).json({error:'User created the task does not exist'});
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
    


//assign users to task
router.post('/assign_user_to_task', (req, res) => {
    const taskName = req.body.taskName
    const userName = req.body.userName

    //check if task exists
    Task.findOne({taskName:taskName})
    .then(task => {
        if(task)
        {
            //check if user exists
            User.findOne({userName:userName})
            .then(user => {
                if(user)
                {
                    //check if user is already assigned to task
                }
                else
                {
                    console.log('User does not exist');
                    res.status(404).json({error:'User does not exist'});
                }
        })}
        else
        {
            console.log('Task not found');
            res.status(404).json({error:'Task not found'})
        }
    })

})



module.exports = router;