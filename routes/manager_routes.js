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
    const taskTotalStoryPoints = req.body.taskTotalStoryPoints

  
           
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
                                        taskPriority:taskPriority,
                                        taskTotalStoryPoints:taskTotalStoryPoints
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


                                    task.taskDescription = taskDescription;
                                    task.taskDeadline = taskDeadline;
                                    task.taskStatus = taskStatus;
                                    task.taskCreatedBy = taskCreatedBy;
                                    task.taskPriority = taskPriority;
                              

                                    task.save()

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





//assign users to task
router.post('/assign_user_to_task', (req, res) => {
    const id = req.body.id
    const taskName = req.body.taskName
    const userName = req.body.userName
    const toDo = req.body.toDo
    const progress = req.body.progress
    const assignedStoryPoints = Number(req.body.assignedStoryPoints)

//check if log entry exists
Task_User_Log.findOne({id:id})
.then(log => {
    if(log)
    {
        console.log('Log entry with that id already exists');
        res.status(409).json({error:'Log entry with that id already exists'});
    }
    else
    {
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

                    //check user role is employee
                    if(user.userRole === 'employee')
                        {
   //check the task story points 
   if(task.taskTotalStoryPoints < assignedStoryPoints)
    {
        console.log('Assigned story points exceeds total story points ');
        res.status(400).json({error:'Assigned story points exceeds total story points '});
    }
    else
    {
     
       //check user assigned to the task already
          Task_User_Log.find({taskName:taskName,userName:userName})
            .then(task_logs => 
                {
                    if(task_logs.length > 0)
                    {
                        console.log('User already assigned to the task');
                        res.status(409).json({error:'User already assigned to the task'});
                    }
                    else
                    {
                      
                 //check other employee assigned story points to the task
          Task_User_Log.find({taskName:taskName})
          .then(logs => {

      
              let assignedStoryPointsOfAllUsers = 0;
              logs.forEach(log => {
                  assignedStoryPointsOfAllUsers += log.assignedStoryPoints;
              })

       
              
              if((assignedStoryPointsOfAllUsers + assignedStoryPoints) > task.taskTotalStoryPoints)
              {
                  console.log('Assigned story points exceeds total story points');
                  res.status(400).json({error:'Assigned story points exceeds total story points '});
              }
              else
              {
                  const newLog = new Task_User_Log({
                      id:id,
                      taskName:taskName,
                      userName:userName,
                      toDo:toDo,
                      progress:progress,
                      assignedStoryPoints:assignedStoryPoints
                  })
                  newLog.save()
                  .then(() => {
                      console.log('User assigned to task');
                      res.status(200).json({message:'User assigned to task'});
                  })
                  .catch((error) => {
                      console.log('Error assigning user to task');
                      res.status(500).json({error:'Error assigning user to task'});
                  })
              }
          })
                
                    }})

                    }


                        }
                        else
                        {
                            console.log('User is not an employee');
                            res.status(400).json({error:'User is not an employee'});
                        }
               
                 
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


    }
})

})


//update task assignee details (progress, assigned story points , specific detail)
router.put('/update_assignee', (req, res) => {
    const id = req.body.id
    const taskName = req.body.taskName
    const userName = req.body.userName
    const toDO = req.body.toDo
    const progress = req.body.progress
    const assignedStoryPoints = Number(req.body.assignedStoryPoints)

    //check if log entry exists
    Task_User_Log.findOne({id:id})
    .then(log => {
        if(log)
        {
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
                            //check the task story points 
                            if(task.taskTotalStoryPoints < assignedStoryPoints)
                            {
                                console.log('Assigned story points exceeds total story points ');
                                res.status(400).json({error:'Assigned story points exceeds total story points '});
                            }
                            else
                            {
                                //check other employee assigned story points to the task
                                Task_User_Log.find({taskName:taskName})
                                .then(logs => {
                                    let assignedStoryPointsOfAllUsers = 0;
                                    logs.forEach(log => {
                                        assignedStoryPointsOfAllUsers += log.assignedStoryPoints;
                                    })
                                    assignedStoryPointsOfAllUsers -= log.assignedStoryPoints;
                                    if((assignedStoryPointsOfAllUsers + assignedStoryPoints) > task.taskTotalStoryPoints)
                                    {
                                        console.log('Assigned story points exceeds total story points');
                                        res.status(400).json({error:'Assigned story points exceeds total story points '});
                                    }
                                    else
                                    {

                                        log.progress = progress;
                                        log.assignedStoryPoints = assignedStoryPoints;
                                        log.toDo = toDO;
                                        log.save()
                                        .then(() => {
                                            console.log('Updated assignee details');
                                            res.status(200).json({message:'Updated assignee details'});
                                        })
                                        .catch((error) => {
                                            console.log('Error updating assignee details');
                                            res.status(500).json({error:'Error updating assignee details'});
                                        })
                                    }
                                })
                            }
                        }
                        else
                        {
                            console.log('User does not exist');
                            res.status(404).json({error:'User does not exist'});
                        }
                    })
                }
                else
                {
                    console.log('Task not found');
                    res.status(404).json({error:'Task not found'})
                }
            })
        }
        else
        {
            console.log('Log entry not found');
            res.status(404).json({error:'Log entry not found'});
        }
    }
    )
})


//delete user from task
router.delete('/delete_user_from_task', (req, res) => {
    const id = req.body.id

    //check if log entry exists
    Task_User_Log.findOne({id:id})
    .then(log => {
        if(log)
        {
            log.deleteOne()
            .then(() => {
                console.log('User deleted from task');
                res.status(200).json({message:'User deleted from task'});
            })
            .catch((error) => {
                console.log('Error deleting user from task');
                res.status(500).json({error:'Error deleting user from task'});
            })
        }
        else
        {
            console.log('Log entry not found');
            res.status(404).json({error:'Log entry not found'});
        }
    })
})


//view users that assigned to task
router.get('/view_users_assigned_to_task', (req, res) => {
    const taskName = req.body.taskName
    
    //check if task exists
    Task_User_Log.find({taskName:taskName})
    .then(logs => {
        if(logs)
        {
            console.log('Users found');
            res.status(200).json(logs);
        }
        else
        {
            console.log('Users not found');
            res.status(404).json({error:'Users not found'});
        }
    })

})




module.exports = router;