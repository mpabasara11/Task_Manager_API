const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../db_schema_models/user_model.js');
const Task = require('../db_schema_models/task_model.js');
const Task_User_Log = require('../db_schema_models/task_user_log_model.js');
const bcrypt = require('bcrypt');


//middleware for checking request object contain a userRole as employee
router.use((req,res,next) => {
    if(req.userRole === 'employee')
    {
        next();
    }
    else
    {
        res.status(403).json({error:'Forbidden'});
    }
}
)

//view all tasks
router.get('/view_all_tasks',(req,res) => {
    Task.find()
    .then(tasks => {
        if(tasks)
        {
            console.log('Tasks found');
            res.status(200).json(tasks);
        }
        else
        {
            console.log('Tasks not found');
            res.status(404).json({error:'Tasks not found'});
        }
    })
})


//view specific task
router.get('/view_specific_task',(req,res) => {
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


//view all assigned tasks and its details 
router.get('/view_assigned_tasks',(req,res) => {
   const userName = req.body.userName
    Task_User_Log.find({userName:userName})
    .then(task_user_log => {
        if(task_user_log)
        {
            //check the task from task_user_log then find specific tasks from task collection
            let taskNames = []
            task_user_log.forEach(element => {
                taskNames.push(element.taskName)
            });
            Task.find({taskName:{$in:taskNames}})
            .then(tasks => {
                if(tasks)
                {
                    //send task details and task_user_log details together
                    let result = []
                    tasks.forEach(element => {
                        task_user_log.forEach(element2 => {
                            if(element.taskName === element2.taskName)
                            {
                                result.push({taskName:element.taskName,taskDescription:element.taskDescription,taskDeadline:element.taskDeadline,taskStatus:element.taskStatus,taskCreatedBy:element.taskCreatedBy,taskPriority:element.taskPriority,taskTotalStoryPoints:element.taskTotalStoryPoints,logId:element2.id,toDo:element2.toDo,progress:element2.progress,assignedStoryPoints:element2.assignedStoryPoints})
                            }
                        });
                    });
                    if(result)
                    {
                        console.log('Tasks log detail found');
                        res.status(200).json(result);
                    }
                    else
                    {
                        console.log('Tasks log detail not found');
                        res.status(404).json({error:'Tasks log detail not found'});
                    }
                    

                }
                else
                {
                    console.log('Tasks not found');
                    res.status(404).json({error:'Tasks not found'});
                }
            })
        }
        else
        {
            console.log('Tasks not found');
            res.status(404).json({error:'Tasks not found'});
        }
    
      })
})


//update task progress
router.put('/update_task_progress',(req,res) => {
    const logId = req.body.logId
    const progress = Number(req.body.progress)

    Task_User_Log.findOne({id:logId})
    .then(task_user_log => {
        if(task_user_log)
        {
            //check progress is negative
            
            if(progress <0) 
             {
               console.log('Progress cannot be negative');
               res.status(400).json({error:'Progress cannot be negative'});
             }
            //check progress is equal or smaller than assigned story points
           else if(progress <= task_user_log.assignedStoryPoints)
            {
              
               task_user_log.progress = progress
                task_user_log.save()
                .then(() => {
                    console.log('Task progress updated');
                    res.status(200).json({message:'Task progress updated'});
                })
            }
            else
            {
                console.log('Progress is greater than assigned story points');
                res.status(400).json({error:'Progress is greater than assigned story points'});
            }
         
        }
        else
        {
            console.log('Task log not found');
            res.status(404).json({error:'Task log not found'});
        }
    })
}
)














module.exports = router;