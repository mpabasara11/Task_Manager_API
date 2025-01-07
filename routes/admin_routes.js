const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../db_schema_models/user_model.js');
const bcrypt = require('bcrypt');




//create a new user
router.post('/create_user', (req, res) => {
   
        
   const userName = req.body.userName
   const password = req.body.password
   const userRole = req.body.userRole
   const firstName = req.body.firstName
   const lastName = req.body.lastName
   const email = req.body.email
   const nic = req.body.nic
   

//hash the password
const saltRounds = 10;
const passwordHashCode = bcrypt.hashSync(password, saltRounds);

//check if username already exists
User.findOne({userName:userName})
.then(user => {
    if(user)
    {
        console.log('User already exists');
        res.status(409).json({error:'User already exists'});
    }
    else
    {
        const newUser = new User({
            userName:userName,
            passwordHashCode:passwordHashCode,
            userRole:userRole,
            firstName:firstName,
            lastName:lastName,
            email:email,
            nic:nic
        });

        newUser.save()
        .then(() => {
            console.log('User created');
            res.status(201).json({message:'User created'});
        })
        .catch(error => {
            console.error('Error while saving the user:',error);
            res.status(500).json({error:'Internal server error'});
        });
    }
})
})


//update user details
router.put('/update_user', (req, res) => {

    const userName = req.body.userName
    const password = req.body.password
    const userRole = req.body.userRole
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email
    const nic = req.body.nic

//hash the password
const saltRounds = 10;
const passwordHashCode = bcrypt.hashSync(password, saltRounds);

//check if username already exists
User.findOne({userName:userName})
.then(user => {
    if(user)
    {
        user.passwordHashCode = passwordHashCode;
        user.userRole = userRole;
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.nic = nic;

        user.save()
        .then(() => {
            console.log('User updated');
            res.status(200).json({message:'User updated'});
        })
        .catch(error => {
            console.error('Error while updating the user:',error);
            res.status(500).json({error:'Internal server error'});
        });
    }
    else
    {
        console.log('User not found');
        res.status(404).json({error:'User not found'});
    }
})

})


//delete user
router.delete('/delete_user',(req,res)=>{

    const userName = req.body.userName

    User.findOne({userName:userName})
    .then(user => {
        if(user)
        {
            user.deleteOne()
            .then(() => {
                console.log('User deleted');
                res.status(200).json({message:'User deleted'});
            })
            .catch(error => {
                console.error('Error while deleting the user:',error);
                res.status(500).json({error:'Internal server error'});
            })
        }
        else
        {
            console.log('User not found')
            res.status(404).json({error:'User not found'});
        }
    })
})


//get all users
router.get('/get_all_users',(req,res)=>{

    User.find()
    .then(users => {
        console.log('Users found');
        res.status(200).json(users);
    })
    .catch(error => {
        console.error('Error while getting all users:',error);
        res.status(500).json({error:'Internal server error'});
    });
})



//get user by username
router.get('/get_user',(req,res)=>
    {
        const userName = req.body.userName

        User.findOne({userName:userName})
        .then(user => {
            if(user)
            {
                console.log('User found');
                res.status(200).json(user);
            }
            else
            {
                console.log('User not found');
                res.status(404).json({error:'User not found'});
            }
        })
    })

module.exports = router;